import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useNavigate, useParams } from "react-router-dom"
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

import { PostValidation } from "@/lib/validation"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queryesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import { useToast } from "../ui/use-toast"
import { IPost } from "@/types"
import FileUploader from "../shared/FileUploader"

type PostFormProps = {
    post?: IPost | null 
    action: "Create" | "Update";
};

function PostForm({ post, action }: PostFormProps) {
    const { id } = useParams()
    const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost();
    const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost();
    const { user } = useUserContext();
    const { toast } = useToast();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            caption: post ? post.caption : "",
            file: [],
            location: post ? post.location : undefined,
            tags: post ? post.tags.join(",") : "",
        },
    });


    const cancelHandle = () => {
        navigate(-1);
    };

    async function handleCreateOrUpdate(values: z.infer<typeof PostValidation>) {
        const { caption, file, location, tags } = values;

        const formData = new FormData();
        formData.append("image", file[0]);
        formData.append("caption", caption);
        formData.append("location", location || "");
        formData.append("tags", tags || "");

        if (post && action === "Update" && id) {
            try {

                const updatedPost = await updatePost({ id, post: formData });
                if (updatedPost) {
                    toast({ title: "Post atualizado com sucesso" });
                }
                return navigate(`/posts/${post.id}`);
            } catch (error) {
                toast({ title: "Erro ao atualizar o post." });
            }
        } else {
            try {
                const response = await createPost(formData);

                if (response) {
                    toast({ title: "Post criado  com sucesso" });
                    return navigate(`/`);
                }

            } catch (error) {
                toast({ title: "Erro ao atualizar o post." });
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateOrUpdate)} className="flex flex-col gap-9 w-full max-w-5xl">
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
                                <FileUploader fieldChange={field.onChange} mediaUrl={post?.image[0].url} />
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
                                <Input
                                    type="text"
                                    className="shad-input"
                                    {...field}
                                    value={field.value ?? ""} 
                                />
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
                            <FormLabel className="shad-form-label">Adicionar Tags (separado por vírgula ",")</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    className="shad-input"
                                    placeholder="Artes, Música, Conhecimento"
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
                        {isLoadingCreate || isLoadingUpdate ? "Criando..." : action === "Create" ? "Criar" : "Atualizar"}{" "}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default PostForm;