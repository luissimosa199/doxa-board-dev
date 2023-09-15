import { getServerSession } from "next-auth"
import { GetServerSideProps } from "next/types"
import { FunctionComponent } from "react"
import { CustomSession, authOptions } from "./api/auth/[...nextauth]"

interface AdminPageInterface {
    name: string
    email: string
}

const Admin: FunctionComponent<AdminPageInterface> = ({ name, email }) => {


    // Your component logic remains here
    return (
        <div>
            <p>Logueado como {name} ({email})</p>

        </div>
    )
}

export const getServerSideProps: GetServerSideProps<AdminPageInterface> = async (context) => {
    const session: CustomSession | null = await getServerSession(context.req, context.res, authOptions)

    if (!session || session?.role !== "ADMIN") {
        return {
            redirect: {
                destination: session ? '/' : '/login',
                permanent: false
            }
        }
    }

    // If the user is an admin, proceed to render the page
    return {
        props: {
            name: session?.user?.name || "Usuario",
            email: session?.user?.email || "Usuario",
        }
    }
}

export default Admin
