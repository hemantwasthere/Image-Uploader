import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React from "react";
import { toast } from "react-toastify";
import { db, storage } from "../firebase";


export default function DeleteArticle({ id, imageUrl }) {
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this article?")) {
            try {
                await deleteDoc(doc(db, "articles", id));
                toast("file deleted successfully", { type: "success" });
                const storageRef = ref(storage, imageUrl);
                await deleteObject(storageRef);
            } catch (error) {
                toast("Error in deleting file", { type: "error" });
                console.log(error);
            }
        }
    };
    return (
        <button onClick={handleDelete} className="cursor-pointer transition-all duration-300 border-[1.3px] border-red-500 text-xs sm:text-sm py-[5px] sm:py-2 px-2 rounded-md hover:bg-red-500 hover:text-white ">Delete</button>
    );
}