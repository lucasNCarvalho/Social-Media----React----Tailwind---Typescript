import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import profile from "../../../public/assets/images/profile.png";
import editWhite from "../../../public/assets/icons/edit-white.svg";
import { useUserContext } from "@/context/AuthContext";

const ProfileValidation = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  userName: z.string().min(1, "O nome de usuário é obrigatório."),
  email: z.string().email("Insira um email válido."),
  bio: z.string().optional(),
  password: z.string().optional(),
  file: z.instanceof(File).optional(),
});

type ProfileFormType = z.infer<typeof ProfileValidation>;

function UpdateProfile() {

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { user } = useUserContext();
  console.log('user', user)
  const form = useForm<ProfileFormType>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      name: "",
      userName: "",
      email: "",
      bio: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        userName: user.userName || "",
        email: user.email || "",
        bio: user.bio || "",
      });
      setSelectedImage(user.imageUrl || null);
    }
  }, [user, form]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      form.setValue("file", file);
    }
  };

  const handleUpdateUser = (values: ProfileFormType) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("userName", values.userName);
    formData.append("bio", values.bio || "");
    if (values.password) {
      formData.append("password", values.password);
    }
    if (values.file) {
      formData.append("file", values.file);
    }

    console.log('data', values, 'imnage', selectedImage)
  };

  return (
    <div className="common-container">
      <div className="flex justify-start w-full gap-3">
        <img src={editWhite} width={32} height={32} alt="Edit Icon" />
        <h2 className="h3-bold md:h2-bold text-left w-full">Editar perfil</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdateUser)} className="flex flex-col gap-6 w-full">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-gray-300">
              <img
                src={selectedImage || profile}
                alt="Profile"
                className="w-14 h-14 rounded-full object-cover"
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
                  <Input type="text" placeholder="Seu nome" {...field} className="shad-input-light" />
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
                <FormLabel>Nome de usuário</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Seu nome de usuário"
                    {...field}
                    className="shad-input-light"
                  />
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
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    {...field}
                    className="shad-input-light"
                    disabled
                  />
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
                  <Input
                    type="text"
                    placeholder="Uma breve descrição sobre você"
                    {...field}
                    className="shad-input-light"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Digite sua nova senha"
                    {...field}
                    className="shad-input-light"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button type="submit" className="shad-button_primary whitespace_nowrap">
              Atualizar Perfil
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default UpdateProfile;
