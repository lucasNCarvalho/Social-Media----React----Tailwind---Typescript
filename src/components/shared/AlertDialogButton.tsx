import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface AlertDialogButtonProps {
    handleDeletePost: () => Promise<void>
}

function AlertDialogButton({handleDeletePost}: AlertDialogButtonProps) {

    const confirmDelete = async () => {
        await handleDeletePost(); 
    };

    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger>
                    <img
                        src="/assets/icons/delete.svg"
                        alt="delete"
                        width={26}
                        height={26}
                        className="mt-2"
                    />
                </AlertDialogTrigger>
                <AlertDialogContent className=" bg-dark-3">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Essa ação não pode ser desfeita, a publicação sera removida de forma permanente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Continuar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default AlertDialogButton


