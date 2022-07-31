import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { db, storage } from "../firebase";
import { toast } from "react-toastify";
import { deleteObject, ref } from "firebase/storage";


export default function DeleteArticle({ id, imageUrl }) {
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this article?")) {
            try {
                await deleteDoc(doc(db, "articles", id));
                toast("Article deleted successfully", { type: "success" });
                const storageRef = ref(storage, imageUrl);
                await deleteObject(storageRef);
            } catch (error) {
                toast("Error deleting article", { type: "error" });
                console.log(error);
            }
        }
    };
    return (
        <button onClick={handleDelete} className="cursor-pointer transition-all duration-300 border-[1.3px] border-red-500 py-2 px-2 rounded-md hover:bg-red-500 hover:text-white  " >Delete</button>
    );
}