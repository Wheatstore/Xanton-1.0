import { useEffect } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Test() {
    const historical_figures = [
        {
            id: "socrates",
            name: "Socrates",
            description: "Talk to the classical Greek philosopher credited as one of the founders of Western philosophy.",
            img: "/images/socrates.webp"
        },
        {
            id: "alexander_the_great",
            name: "Alexander the Great",
            description: "Talk to the King of Macedonia who created one of the largest empires in ancient history.",
            img: "/images/alexander_the_great.webp"
        },
        {
            id: "florence_nightingale",
            name: "Florence Nightingale",
            description: "Talk to the founder of modern nursing, known for her work during the Crimean War.",
            img: "/images/florence_nightingale.webp"
        },
        {
            id: "galileo_galilei",
            name: "Galileo Galilei",
            description: "Talk to the Italian astronomer, physicist, and engineer who made pioneering observations that laid the foundation for modern physics and astronomy.",
            img: "/images/galileo_galilei.webp"
        },
        {
            id: "catherine_the_great",
            name: "Catherine the Great",
            description: "Talk to the Empress of Russia who expanded the Russian Empire and promoted Westernization and modernization.",
            img: "/images/catherine_the_great.webp"
        },
        {
            id: "genghis_khan",
            name: "Genghis Khan",
            description: "Talk to the founder of the Mongol Empire, which became the largest contiguous empire in history.",
            img: "/images/genghis_khan.webp"
        }
    ]
    const blogPosts = [{
        id: "einstein_blog_001",
        title: "Explore the Genius Behind the Theory of Relativity",
        description: "Delve into the extraordinary life of Albert Einstein, exploring his early years, groundbreaking work, and lasting legacy in science and beyond.",
        author: "John Doe",
        content: {
            earlyLifeAndEducation: {
                heading: "Early Life and Education: The Making of a Genius",
                text: "Albert Einstein, born on March 14, 1879, in Ulm, Germany, showed an early fascination with mathematics and physics. His supportive parents nurtured his curiosity, and his family moved to Munich during his childhood. At the Luitpold Gymnasium, Einstein excelled academically and fostered a passion for independent thought. By 16, he applied to the Swiss Federal Polytechnic in Zurich, overcoming initial struggles to gain admission."
            },
            miraculousYear: {
                heading: "The Miraculous Year: Papers that Changed Physics",
                text: "1905, often called Einstein's 'annus mirabilis' or miraculous year, saw him publish four revolutionary papers: \n1. 'On a Heuristic Point of View Concerning the Production and Transformation of Light': Introduced the photon concept and explained the photoelectric effect. \n2. 'On the Electrodynamics of Moving Bodies': Presented the special theory of relativity and the iconic equation E=mc². \n3. 'On the Movement of Small Particles Suspended in Stationary Liquids Required by the Molecular-Kinetic Theory of Heat': Explained Brownian motion, providing evidence for atoms. \n4. 'On the Electrodynamics of Moving Bodies': Further elaborated on the theory of relativity and mass-energy equivalence."
            },
            publicLife: {
                heading: "From Nobel Laureate to Political Advocate: Einstein's Public Life",
                text: "In 1921, Einstein received the Nobel Prize in Physics for his work on the photoelectric effect. Beyond his scientific achievements, he was a fervent advocate for peace and social justice, speaking against war, racism, and nuclear weapons. Einstein engaged in politics, joining organizations like the League of Nations and the International Committee on Intellectual Cooperation. In 1933, fleeing Nazi Germany, he settled in the United States and became a professor at Princeton's Institute for Advanced Study."
            },
            legacy: {
                heading: "Einstein's Legacy in Modern Science",
                text: "Einstein's work profoundly impacted our understanding of the universe: \n- Theory of Relativity: Revolutionized physics and cosmology, challenging perceptions of space, time, and gravity. \n- E=mc²: Became synonymous with mass-energy equivalence, crucial in developing nuclear energy. \n- Photoelectric Effect: Laid the groundwork for quantum mechanics, earning him the Nobel Prize. \nEinstein's influence extends beyond science, permeating philosophy, literature, art, and popular culture, cementing his status as a cultural icon."
            },
            personalStruggles: {
                heading: "Personal Struggles and Triumphs: The Man Behind the Mind",
                text: "Despite his intellectual prowess, Einstein faced personal challenges. His first marriage to Mileva Marić ended in divorce in 1919, and he later married his cousin, Elsa Löwenthal. As a Jewish scientist in Nazi Germany, he encountered significant anti-Semitism. Nevertheless, Einstein remained devoted to his work, continuing to make groundbreaking contributions despite these obstacles. In his later years, he grappled with health issues but remained mentally active until his death on April 18, 1955."
            }
        }
    }];

    const blogPosts2 = [{
        id: "alexander_the_great_blog_001",
        title: "The Legendary Conquests of Alexander the Great",
        description: "Dive into the remarkable life of Alexander the Great, exploring his early years, legendary conquests, and enduring legacy as one of history's greatest military leaders.",
        author: "Jane Smith",
        content: {
            earlyLifeAndEducation: {
                heading: "Early Life and Education: The Making of a Conqueror",
                text: "Alexander the Great was born on July 20, 356 BC, in Pella, the ancient capital of Macedonia. He was the son of King Philip II and Queen Olympias. From a young age, Alexander displayed immense ambition and intelligence. His education was supervised by the philosopher Aristotle, who instilled in him a love for philosophy, science, medicine, and literature. These early influences shaped Alexander into a well-rounded and strategic leader."
            },
            riseToPower: {
                heading: "Rise to Power: Unifying Greece",
                text: "Following the assassination of his father in 336 BC, Alexander ascended to the throne of Macedonia. He swiftly dealt with internal and external threats to his rule, uniting the Greek city-states under his leadership. His decisive victories and diplomatic skills solidified his control over Greece, setting the stage for his ambitious plans to conquer the Persian Empire."
            },
            conquests: {
                heading: "The Conquests: A Campaign of Unprecedented Scale",
                text: "Alexander's military campaign against the Persian Empire began in 334 BC. Over the next decade, he led his army through Asia Minor, Egypt, Mesopotamia, Persia, and into the Indus Valley. Key battles such as the Battle of Issus, the Siege of Tyre, and the Battle of Gaugamela showcased his tactical brilliance and strategic ingenuity. By 323 BC, Alexander had created one of the largest empires in history, stretching from Greece to northwestern India."
            },
            culturalImpact: {
                heading: "Cultural Impact: Spreading Hellenistic Influence",
                text: "Alexander's conquests had a profound cultural impact, as he sought to blend Greek culture with the diverse cultures of the lands he conquered. This era, known as the Hellenistic Period, saw the spread of Greek language, art, architecture, and philosophy throughout the known world. Alexander founded numerous cities, many of which became centers of learning and culture, fostering an exchange of ideas and traditions."
            },
            legacy: {
                heading: "Alexander's Legacy: A Lasting Influence on History",
                text: "Alexander the Great's legacy endures through the centuries, influencing military strategy, leadership, and cultural integration. His vision of a united world under a single ruler inspired countless leaders and empires. Despite his untimely death in 323 BC at the age of 32, his legend lived on, shaping the course of history and leaving an indelible mark on civilization."
            },
            personalLife: {
                heading: "Personal Life: The Man Behind the Legend",
                text: "Beyond his military prowess, Alexander was known for his charismatic personality and complex relationships. He was close to his mother, Olympias, and his trusted generals, including Hephaestion, who was his lifelong friend and confidant. Alexander's personal life was marked by ambition and a relentless pursuit of greatness, which often came at the cost of personal happiness. His marriage to Roxana of Bactria and subsequent marriages were politically motivated, aimed at consolidating his empire."
            }
        }
    }];

    const addToServer = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const botsCollection = collection(db, 'bots');
            for (let figure of historical_figures) {
                // Check if the document already exists based on the name
                const q = query(botsCollection, where("name", "==", figure.name));
                const querySnapshot = await getDocs(q);
                
                if (querySnapshot.empty) {
                    // Add a new document with a generated ID
                    await addDoc(botsCollection, figure);
                    console.log(`Document for ${figure.name} added.`);
                } else {
                    console.log(`Document for ${figure.name} already exists.`);
                }
            }
        } else {
            console.log("User is not authenticated");
        }
    };

    const addToBlog = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
    
        if (user) {
            const blogsCollection = collection(db, 'blogs');
            for (let post of blogPosts2) {
                // Add a new document with a generated ID
                await addDoc(blogsCollection, post);
                console.log(`Document for ${post.title} added.`);
            }
        } else {
            console.log("User is not authenticated");
        }
    };

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is authenticated");
            } else {
                console.log("User is not authenticated");
            }
        });
    }, []);

    return (
        <>
            <button>Click here</button>
            
        </>
    );
}

export default Test;