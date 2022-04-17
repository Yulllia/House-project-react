
import { getAuth, updateProfile } from "firebase/auth"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { updateDoc, doc,collection, getDocs,query, where, orderBy,deleteDoc } from "firebase/firestore";
import { db } from "../firabase.config";
import { toast } from 'react-toastify';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
import ListeningItem from "./ListeningItem";

function Profile() {
  const auth = getAuth();
  const [changeDatail, setChangeDetails] = useState(false)
  const[listings, setListings] = useState(null);
  const[loading,setLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData
  const onLogout = () => {
    auth.signOut()
    navigate("/")
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const onDelete = async(listingId) =>{
   if(window.confirm("Are you sure you want to delete?")){
   await deleteDoc(doc(db, "listenings", listingId));
   const updateListinings = listings.filter((listings)=>listings.id !== listingId);
   setListings(updateListinings);
   toast.success("Delete listing successful")
   }
  }

  const onEdit = (listingId) =>{
  navigate(`/edit-listing/:${listingId}`)
  }
  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        //update name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        })
        //update name in firestore
        const useRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(useRef,{
          name:name
        })
      }
    } catch (error) {
      toast.error("Didn't update details")
    }
  }
  const navigate = useNavigate();

  useEffect(()=>{
  const fetchUserListings = async()=>{
   const listingRef = collection(db, "listenings");
   const q = query(listingRef, where("useRef", "==", auth.currentUser.uid), orderBy("timestamp", "desc"))
   const querySnap = await getDocs(q)
   const listings=[];
   querySnap.forEach((doc)=>{
     console.log(doc)
     return listings.push({
       id:doc.id,
       data:doc.data()
     })
   })
   setListings(listings);
   console.log(listings)
   setLoading(false)
  }
  fetchUserListings()
  },[auth.currentUser.uid])

  return <div className="profile">
    <header className="profileHeader">
      <p className="pageHeader">My Profile</p>
      <button type="button" className="logOut" onClick={onLogout}>Logout</button>
    </header>
    <main>
      <div className="profileDetailsHeader">
        <p className="profileDetailsText">Personal Details</p>
        <p className="changePersonalDetails" onClick={() => {
          changeDatail && onSubmit()
          setChangeDetails((prev) => !prev)
        }}>
          {changeDatail ? "done" : "change"}
        </p>
      </div>
      <div className="profileCard">
        <form>
          <input type="text" id="name" onChange={onChange} value={name} className={!changeDatail ? "profileName" : "profileNameActive"} disabled={!changeDatail} />
          <input type="text" id="email" onChange={onChange} value={email} className={!changeDatail ? "profileEmail" : "profileEmailActive"} disabled={!changeDatail} />
        </form>
      </div>
    </main>
    <Link to="/create-listing" className="createListing">
      <img src={homeIcon} alt="home" />
      <p>Sell or rent you home</p>
      <img src={arrowRight} alt="arrowRight" />
    </Link>
    {!loading && listings?.length>0 && (
   <>
<p className="listingText">Your listings</p>
<ul className="listingList">
  {listings.map((listing)=>(
  <ListeningItem key={listing.id} listening={listing.data} id={listing.id} onDelete={()=>onDelete(listing.id) } onEdit={()=>onEdit(listing.id) }/>
  ))}
</ul>
   
   </>
    )}
  </div>
}

export default Profile