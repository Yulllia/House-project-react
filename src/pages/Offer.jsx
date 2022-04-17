import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { collection, getDocs, query, where, orderBy, limit,startAfter } from "firebase/firestore"
import { db } from "../firabase.config"
import { toast } from "react-toastify"
import Spinner from "../components/Spinner"
import ListeningItem from "./ListeningItem"
import React from 'react'


function Offer() {
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
                const q = query(listeningsRef, where("offer", "==", true), orderBy("timestamp", "desc"), limit(10))
                //execute query
                const querySnap = await getDocs(q)
                console.log(querySnap)
                const lastVisible = querySnap.docs[querySnap.docs.length-1]
                setLastFetchListing(lastVisible)
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
    }, [])
// Pagination more 10 image
    const onFetchMoreListings = async () => {
        try {
            //get reference
            const listeningsRef = collection(db, "listenings")
            //create query 
            const q = query(listeningsRef, where("offer", "==", true), orderBy("timestamp", "desc"), startAfter(lastFetchListing),limit(10))
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
                 Offers
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
            </div> : <p>There are not current offers</p>}
            {lastFetchListing &&(
               <p className="loadMore" onClick={onFetchMoreListings}>Load More</p> 
            )}
        </div>
    )
}

export default Offer