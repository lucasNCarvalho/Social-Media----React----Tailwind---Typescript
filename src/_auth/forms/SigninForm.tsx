
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { SigninValidation } from "@/lib/validation"
import { z } from "zod"
import Loader from "@/components/shared/Loader"
import { createUserAccount } from "@/lib/appwrite/api";
import { useToast } from "@/components/ui/use-toast"
import {  useSignInAccount } from "@/lib/react-query/queryesAndMutations";
import { ReceiptRussianRuble } from "lucide-react";
import { useUserContext } from "@/context/AuthContext";



function SigninForm() {
  const { toast } = useToast()
  const { checkAuthUser, isLoading: isUserLoading} = useUserContext();
  const navigate = useNavigate();

 
  const { mutateAsync: signInAccount} = useSignInAccount();
 
  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    console.log("valores", values)
    const session = await signInAccount({
      email: values.email,
      password: values.password
    })  

    console.log("r", session)

    if(!session) {
      return toast({title: 'Login falhou, por favor tente novamente.'})
    } 

    const isLoggedIn = await checkAuthUser  ();  

    if(isLoggedIn) {
      form.reset();

      navigate('/');
    } else {
      return toast({title: 'Login falhou, por favor tente novamente.'})
    }
  }
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Fazer login</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">Bem vindo de volta, entre com seus dados</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
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
            {isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader />Carregando...
              </div>
            ) : "Entrar"}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Não tem uma conta?
            <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">Inscreva-se</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm;