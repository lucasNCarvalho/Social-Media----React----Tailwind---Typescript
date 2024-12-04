import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import profile from "../../../public/assets/images/profile.png";
import editWhite from "../../../public/assets/icons/edit-white.svg";

const ProfileValidation = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  userName: z.string().min(1, "O nome de usuário é obrigatório."),
  email: z.string().email("Insira um email válido."),
  bio: z.string().optional(),
  file: z.instanceof(File).optional(),
});

type ProfileFormType = z.infer<typeof ProfileValidation>;

function UpdateProfile() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const form = useForm<ProfileFormType>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      name: "",
      userName: "",
      email: "",
      bio: "",
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      form.setValue("file", file);
    }
  };

  const onSubmit = (values: ProfileFormType) => {
    console.log("Form Values:", values);
  };

  return (
    <div className="common-container">
      <div className="flex justify-start w-full gap-3">
        <img src={editWhite} width={32} height={32} alt="Edit Icon" />
        <h2 className="h3-bold md:h2-bold text-left w-full">Editar perfil</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full  border-2 border-gray-300">
              <img
                src={selectedImage || profile}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <label htmlFor="upload" className="cursor-pointer text-blue hover:underline">
              Troque foto de perfil
              <input
                id="upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>


          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Nome</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Seu nome" {...field} className="shad-input-light " />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel >Nome de usuário</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Seu nome de usuário" {...field} className="shad-input-light" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="seu@email.com" {...field} className="shad-input-light" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Uma breve descrição sobre você" {...field} className="shad-textarea-light" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              className="shad-button_primary whitespace_nowrap"
            >
              Atualizar Perfil
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default UpdateProfile;
