import session from "@/pages/session";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Swal from "sweetalert2";

const BlogPostCardButtons = ({
  _id,
  authorId,
}: {
  _id: string;
  authorId: string;
}) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const handleDeleteTimeline = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    try {
      const willDelete = await Swal.fire({
        title: "Estas seguro?",
        text: "Esta publicación no podrá ser recuperada una vez confirmes",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Borrar",
        cancelButtonText: "Volver",
        reverseButtons: true,
      });

      if (willDelete.isConfirmed) {
        const response = await fetch(`/api/timeline/${_id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const data = await response.json();

          queryClient.invalidateQueries(["timelines"]);

          Swal.fire({
            title: "Publicación borrada",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: `Error: ${response.status} ${response.statusText}`,
            icon: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error: ", error);

      Swal.fire({
        title: `Error: ${JSON.stringify(error)}`,
        icon: "error",
      });
    }
  };

  return (
    <div className="w-fit flex bg-white shadow-md p-2 absolute bottom-2 right-2">
      {_id !== "newitem" && session?.user?.email === authorId && (
        <>
          <Link
            className="text-black w-6 h-6 transition ease-in-out duration-150"
            href={`/nota/editar/${_id}`}
          >
            <FontAwesomeIcon
              icon={faPenToSquare}
              size="lg"
            />
          </Link>
          <button
            className="w-5 h-5"
            onClick={handleDeleteTimeline}
          >
            <FontAwesomeIcon
              icon={faTrashCan}
              size="lg"
              className="text-black transition ease-in-out duration-150"
            />
          </button>
        </>
      )}
    </div>
  );
};

export default BlogPostCardButtons;
