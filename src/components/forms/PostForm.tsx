import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { PostValidation } from "@/lib/validation"
import { Models } from "appwrite"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queryesAndMutations"
import { useContext } from "react"
import { useUserContext } from "@/context/AuthContext"
import { toast, useToast } from "../ui/use-toast"


type PostFormProps = {
    post?: Models.Document;
    action: 'Create' | 'Update';
}

const imageConvertBlob = async (file: any) => {
  
    return new Promise ((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file[0]);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        }

    })
}



function PostForm({ post, action }: PostFormProps) {

    const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost();
    const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost();

    const { user } = useUserContext()
    const { toast } = useToast();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            caption: post ? post?.caption : '',
            file: [],
            location: post ? post?.location : '',
            tags: post ? post.tags.join(',') : ''
        },
    })

    const cancelHandle = () => {
        navigate(-1)
    }



    async function onSubmit(values: z.infer<typeof PostValidation>) {

        const { caption, file, location, tags } = values;

        console.log("type", typeof(file[0]))

        let formData = new FormData()    
        formData.append('file', file[0]);
        formData.append('caption', caption);
        formData.append('location', location);
        formData.append('tags', tags);
        formData.append('userId', user.id);

        console.log("formData", formData)
    
        if (post && action === 'Update') {
            const updatedPost = await updatePost({
                caption,
                file,
                location,
                tags,
                postId: post.$id,
                imageId: post?.imageId,
                imageUrl: post?.imageUrl,
            })

            if (!updatePost) {
                toast({ title: 'Por favor tente novamente' })
            }

            return navigate(`/posts/${post.$id}`)
        }




        // const newPosts = await createPost({
        //     caption,
        //     file,
        //     location,
        //     tags,
        //     userId: user.id,
        //     imagem: formData
        // })


        const newPost = await createPost(formData)
        if (!newPost) {
            toast({
                title: 'Por favor tente novamente'
            })
        }

        navigate('/');
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
                <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form-label">Descrição</FormLabel>
                            <FormControl>
                                <Textarea className="shad-textarea custom-scrollbar" {...field} />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form-label">Adicionar Fotos</FormLabel>
                            <FormControl>
                                <FileUploader fieldChange={field.onChange} mediaUrl={post?.imageUrl} />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form-label">Adicione uma localização</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" {...field} />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form-label">Adicionar Tags (separado por virgula " , ")</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    className="shad-input"
                                    placeholder="Artes, Musica, Conhecimento"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />
                <div className="flex gap-4 items-center justify-end">
                    <Button
                        type="button"
                        className="shad-button_dark_4"
                        onClick={cancelHandle}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="shad-button_primary whitespace_nowrap"
                        disabled={isLoadingCreate || isLoadingUpdate}
                    >
                        {isLoadingCreate || isLoadingUpdate && 'Carregando...'}
                        {action === 'Create' ? 'Criar' : 'Atualizar'} Post
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default PostForm