
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { SignupValidation } from "@/lib/validation"
import { z } from "zod"

import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queryesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import Loader from "@/components/shared/Loader";



function SignupForm() {
  const { toast } = useToast()
  const { checkAuthUser } = useUserContext();


  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount } = useSignInAccount();


  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      userName: "",
      email: "",
      password: ""
    },
  })


  async function onSubmit(values: z.infer<typeof SignupValidation>) {

    const newUser = await createUserAccount(values);

    if (!newUser) {
      return toast({ title: 'Registro falhou, por favor tente novamente.' })
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password
    })

    if (!session) {
      return toast({ title: 'Login falhou, por favor tente novamente.' })
    }

    await checkAuthUser();

    // if(isLoggedIn) {
    //   form.reset();

    //   navigate('/');
    // } else {
    //   return toast({title: 'Login falhou, por favor tente novamente.'})
    // }
  }
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Criar uma nova conta</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">Para usar o SnapGram, por favor entre com seus dados.</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
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
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
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
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
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
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingAccount ? (
              <div className="flex-center gap-2">
                <Loader />Carregando...
              </div>
            ) : "Inscreva-se"}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Já possui uma conta?
            <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Entrar</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm