import { faYoutube } from "@fortawesome/free-brands-svg-icons"
import { faCamera, faTag, faLink, faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfilePicture from "./ProfilePicture"
import { useSession } from "next-auth/react"
import { useState } from "react"

const PrimaryForm = () => {

    const [tagInputVisibility, setTagInputVisibility] = useState<boolean>(false)
    const [linkInputVisibility, setLinkInputVisibility] = useState<boolean>(false)
    const [ytInputVisibility, setYtInputVisibility] = useState<boolean>(false)

    const [openModule, setOpenModule] = useState<boolean>(false)

    const { data: session } = useSession()

    const moduleOpen = () => {
        return tagInputVisibility
    }


    type ModuleName = "tags" | "links" | "yts";
    type ToggleFunction = (name: ModuleName) => void

    const toggleOpenModule: ToggleFunction = (name) => {
        if (name === "tags") {
            if (tagInputVisibility) {
                setTagInputVisibility(false);
                setOpenModule(false)
                return
            }
            setTagInputVisibility(true);
            setLinkInputVisibility(false);
            setYtInputVisibility(false);
            setOpenModule(true);
        } else if (name === "links") {
            if (linkInputVisibility) {
                setLinkInputVisibility(false);
                setOpenModule(false)
                return
            }
            setLinkInputVisibility(true);
            setTagInputVisibility(false);
            setYtInputVisibility(false);
            setOpenModule(true);
        } else if (name === "yts") {
            if (ytInputVisibility) {
                setYtInputVisibility(false);
                setOpenModule(false)
                return
            }
            setYtInputVisibility(true);
            setTagInputVisibility(false);
            setLinkInputVisibility(false);
            setOpenModule(true);
        }
    }

    return (
        <form className="mt-12 border-2 flex flex-col min-h-48 my-4 rounded-md max-w-[850px] mx-auto">
            <div className='h-2/3 flex'>
                <div className='w-32'>
                    {session && <ProfilePicture username={session!.user!.email as string} />}
                </div>
                <textarea placeholder="Escribe algo acá" className='w-full p-2 placeholder:text-2xl' />

            </div>
            <div className={`border-t-2 p-4 ${moduleOpen() ? "h-48" : "h-1/3"}`}>

                <div className=" flex gap-4">
                    <div >
                        <button className="h-8 " onClick={(e) => { e.preventDefault(); console.log("file input") }}>
                            <FontAwesomeIcon className="h-full text-blue-600 cursor-pointer hover:text-blue-500 transition-all " icon={faCamera} />
                        </button>
                    </div>
                    <div  >
                        <button className="h-8 " onClick={(e) => { e.preventDefault(); toggleOpenModule("tags") }}>
                            <FontAwesomeIcon className={`h-full cursor-pointer hover:text-blue-500 transition-all ${tagInputVisibility ? "text-blue-900" : "text-blue-600"} `} icon={faTag} />
                        </button>
                    </div>
                    <div  >
                        <button className="h-8 " onClick={(e) => { e.preventDefault(); toggleOpenModule("links") }}>
                            <FontAwesomeIcon className="h-full text-blue-600 cursor-pointer hover:text-blue-500 transition-all " icon={faLink} />
                        </button>
                    </div>
                    <div  >
                        <button className="h-8 " onClick={(e) => { e.preventDefault(); toggleOpenModule("yts") }}>
                            <FontAwesomeIcon className="h-full text-red-500 cursor-pointer hover:text-red-400 transition-all " icon={faYoutube} />
                        </button>
                    </div>

                    <div className="ml-auto mr-4" >
                        <button className="h-8 ">
                            <FontAwesomeIcon className="h-full text-blue-600 cursor-pointer hover:text-blue-500 transition-all " icon={faPaperPlane} />
                        </button>
                    </div>
                </div>

                {openModule && <div className={`h-24`}>

                </div>}

            </div>
        </form>
    )
}

export default PrimaryForm