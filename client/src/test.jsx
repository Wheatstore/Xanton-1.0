// import { useEffect } from "react";
// import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
// import { db } from "./firebase";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

// function Test() {
//     const historical_figures = [
//         {
//             name: "Socrates",
//             description: "Talk to the classical Greek philosopher credited as one of the founders of Western philosophy.",
//             img: "/images/socrates.webp"
//         },
//         {
//             name: "Hippocrates",
//             description: "Talk to the ancient Greek physician often referred to as the 'Father of Medicine.'",
//             img: "/images/hippocrates.webp"
//         },
//         {
//             name: "Joan of Arc",
//             description: "Talk to the French heroine and saint who led the French army to victory during the Hundred Years' War.",
//             img: "/images/joan_of_arc.webp"
//         },
//         {
//             name: "William Shakespeare",
//             description: "Talk to the English playwright and poet widely regarded as one of the greatest writers in the English language.",
//             img: "/images/william_shakespeare.webp"
//         },
//         {
//             name: "Alexander the Great",
//             description: "Talk to the King of Macedonia who created one of the largest empires in ancient history.",
//             img: "/images/alexander_the_great.webp"
//         },
//         {
//             name: "Florence Nightingale",
//             description: "Talk to the founder of modern nursing, known for her work during the Crimean War.",
//             img: "/images/florence_nightingale.webp"
//         },
//         {
//             name: "Galileo Galilei",
//             description: "Talk to the Italian astronomer, physicist, and engineer who made pioneering observations that laid the foundation for modern physics and astronomy.",
//             img: "/images/galileo_galilei.webp"
//         },
//         {
//             name: "Catherine the Great",
//             description: "Talk to the Empress of Russia who expanded the Russian Empire and promoted Westernization and modernization.",
//             img: "/images/catherine_the_great.webp"
//         },
//         {
//             name: "Genghis Khan",
//             description: "Talk to the founder of the Mongol Empire, which became the largest contiguous empire in history.",
//             img: "/images/genghis_khan.webp"
//         }
//     ];

//     const addToServer = async () => {
//         const auth = getAuth();
//         const user = auth.currentUser;

//         if (user) {
//             const botsCollection = collection(db, 'bots');
//             for (let figure of historical_figures) {
//                 // Check if the document already exists based on the name
//                 const q = query(botsCollection, where("name", "==", figure.name));
//                 const querySnapshot = await getDocs(q);
                
//                 if (querySnapshot.empty) {
//                     // Add a new document with a generated ID
//                     await addDoc(botsCollection, figure);
//                     console.log(`Document for ${figure.name} added.`);
//                 } else {
//                     console.log(`Document for ${figure.name} already exists.`);
//                 }
//             }
//         } else {
//             console.log("User is not authenticated");
//         }
//     };

//     useEffect(() => {
//         const auth = getAuth();
//         onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 console.log("User is authenticated");
//             } else {
//                 console.log("User is not authenticated");
//             }
//         });
//     }, []);

//     return (
//         <>
//             <button onClick={addToServer}>Click here</button>
//         </>
//     );
// }

// export default Test;