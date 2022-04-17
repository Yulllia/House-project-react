import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore"
import { db } from "../firabase.config"
import { toast } from "react-toastify"
import Spinner from "../components/Spinner"
import ListeningItem from "./ListeningItem"

function Category() {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const[lastFetchListing, setLastFetchListing] = useState(null)

    const params = useParams()
    useEffect(() => {
        const fetchListings = async () => {
            try {
                //get reference
                const listeningsRef = collection(db, "listenings")
                //create query 
                const q = query(listeningsRef, where("type", "==", params.categoryName), orderBy("timestamp", "desc"), limit(10))
                //execute query
                const querySnap = await getDocs(q)
                const lastVisible = querySnap.docs[querySnap.docs.length-1]
                setLastFetchListing(lastVisible)
                console.log(querySnap)
                const dataListen = [];
                querySnap.forEach((doc) => {
                    return dataListen.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                setListings(dataListen);
                setLoading(false);
            } catch (error) {
                console.log(error)
              toast.error("Coudn't fetch listenings")
            }
        }
        fetchListings()
    }, [params.categoryName])

     //pagination Load more
    const onFetchMoreListings = async () => {
        try {
            //get reference
            const listeningsRef = collection(db, "listenings")
            //create query 
            const q = query(listeningsRef, where("type", "==", params.categoryName), orderBy("timestamp", "desc"), startAfter(lastFetchListing),limit(10))
            //execute query
            const querySnap = await getDocs(q)
            const lastVisible = querySnap.docs[querySnap.docs.length-1]
            setLastFetchListing(lastVisible)
            console.log(querySnap)
            const dataListen = [];
            querySnap.forEach((doc) => {
                return dataListen.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setListings((prev)=>[...prev, ...dataListen]);
            setLoading(false);
        } catch (error) {
            console.log(error)
          toast.error("Coudn't fetch listenings")
        }
    }

    
    return (
        <div className="category">
            <header>
                <p className="pageHeader">
                    {params.categoryName === "rent" ? "Places for rent": "Places for sale"}
                </p>
            </header>
            {loading ? <Spinner/> : listings && listings.length>0 ? <div>
            <main>
                <ul className="categoryListings">
                    {listings.map((element)=>{
                        console.log(element)
                        return <ListeningItem listening={element.data} id={element.id} key={element.id}/>
                    })}
                </ul>
            </main>
            <br/>
            <br/>
            {lastFetchListing &&(
               <p className="loadMore" onClick={onFetchMoreListings}>Load More</p> 
            )}
            </div> : <p>No listings for {params.categoryName}</p>}
        </div>
    )
}

export default Category