import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from "../firabase.config"
import { v4 as uuidv4 } from "uuid"
import { addDoc,collection,serverTimestamp } from 'firebase/firestore'

function CreateListing() {
    const [geolacationEnables, setGeolacationEnables] = useState(false);
    const [loading, setLoading] = useState(false)
    const [forms, setForms] = useState({
        type: "rent",
        name: "",
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: "",
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        lat: 0,
        lng: 0,
    })
    const { type, name, bedrooms, bathrooms, parking, furnished, address, offer, regularPrice, discountedPrice, images, lat, lng } = forms;
    const auth = getAuth()
    const navigate = useNavigate()
    const isMounted = useRef(true);

    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, user => {
                if (user) {
                    setForms({ ...forms, useRef: user.uid })
                } else {
                    navigate("/sign-in")
                }
            })
        }
        return () => {
            isMounted.current = false
        }
    }, [isMounted])

    if (loading) {
        return <Spinner />
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (discountedPrice >= regularPrice) {
            setLoading(false)
            toast.error("Discounted price need to be less than regular price")
            return
        }
        if (images.length > 6) {
            setLoading(false)
            toast.error("Max 6 images")
            return
        }
          //geolocation with google cloud don't work need billing 
        let geocoding = {}
        let location;
        if (geolacationEnables) {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`);
            const data = await response.json();
            geocoding.lat = data.results[0]?.geometry.location.lat ?? 0
            geocoding.lng = data.results[0]?.geometry.location.lng ?? 0
            location = data.status === "ZERO_RESULTS" ? undefined : data.results[0]?.formatted_address
            if (location === undefined || location.includes("undefined")) {
                setLoading(false)
                toast.error("Please enter a correct address")
                return
            }
        } else {
            geocoding.lat = lat
            geocoding.lng = lng
            location = address
            console.log(geocoding, location)
        }
        //Store images in Firebase
        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage();
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
                const storageRef = ref(storage, 'images/' + fileName);
                const uploadTask = uploadBytesResumable(storageRef, image);
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        reject(error)
                        console.log(error)
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                );
            })
        }

       const imgUrls = await Promise.all([...images].map((image)=>storeImage(image))).catch((error)=>{
        console.log(error)
        setLoading(false);
        toast.error("Images not uploaded")  
        return
       })
       ////Save all data to firebase
       const copyFormData={
           ...forms,
           geocoding,
           imgUrls,
           timestamp:serverTimestamp()
       }
       delete copyFormData.images
       delete copyFormData.address
        copyFormData.location = address
       !copyFormData.offer && delete copyFormData.discountedPrice
       const docRef = await addDoc(collection(db, "listenings"),copyFormData)
        setLoading(false);
        toast.success("Listing saved")
        navigate(`/category/${copyFormData.type}/${docRef.id}`)

    }


    const onMutate = (e) => {
        let boolean = null
        if (e.target.value === true) {
            boolean = true
        }
        if (e.target.value === false) {
            boolean = false
        }

        //Files
        if (e.target.files) {
            setForms((prev) => ({
                ...prev,
                images: e.target.files
            }))
        }
        if (!e.target.files) {
            setForms((prev) => ({
                ...prev,
                [e.target.id]: boolean ?? e.target.value
            }))
        }
    }
    return (
        <div className='profile'>
            <header>
                <p className="pageHeader">Create a Listing</p>
            </header>
            <main>
                <form onSubmit={onSubmit}>
                    <label className='formLabel'>Sell / Rent</label>
                    <div className="formButtons">
                        <button type="button" id="type" value="sale" className={type === "sale" ? "formButtonActive" : "formButton"} onClick={onMutate}>
                            Sell
                        </button>
                        <button type="button" id="type" value="rent" className={type === "rent" ? "formButtonActive" : "formButton"} onClick={onMutate}>
                            Rent
                        </button>
                    </div>
                    <label className='formLabel'>Name</label>
                    <input type="text" id="name" value={name} className="formInputName" maxLength={32} minLength={10} onChange={onMutate} required />
                    <div className="formRooms flex">
                        <div>
                            <label className="formLabel">Bedrooms</label>
                            <input type="number" id="bedrooms" value={bedrooms} min="1" max="50" onChange={onMutate} className="formInputSmall" />
                        </div>
                        <div>
                            <label className="formLabel">Bathrooms</label>
                            <input type="number" id="bathrooms" value={bathrooms} min="1" max="50" onChange={onMutate} className="formInputSmall" />
                        </div>
                    </div>
                    <label className="formLabel">Parking spot</label>
                    <div className="formButtons">
                        <button className={parking ? "formButtonActive" : "formButton"} type="button" id="parking" value={true} onClick={onMutate} min="1" max="50">
                            Yes
                        </button>
                        <button className={!parking && parking !== null ? "formButtonActive" : "formButton"} type="button" id="parking" value={false} onClick={onMutate} min="1" max="50">
                            No
                        </button>
                    </div>
                    <label className="formLabel">Furnished</label>
                    <div className="formButtons">
                        <button className={furnished ? "formButtonActive" : "formButton"} type="button" id="furnished" value={true} onClick={onMutate} min="1" max="50">
                            Yes
                        </button>
                        <button className={!furnished && furnished !== null ? "formButtonActive" : "formButton"} type="button" id="furnished" value={false} onClick={onMutate} min="1" max="50">
                            No
                        </button>
                    </div>
                    <label className="formLabel">Address</label>
                    <textarea className="formInputAddress" type="text" id="address" value={address} onChange={onMutate} required cols="30" rows="10"></textarea>
                    {!geolacationEnables && (
                        <div className='formLatLng flex'>
                            <div>
                                <label className='formLabel'>Latitude</label>
                                <input type="number" id="lat" value={lat} onChange={onMutate} className="formInputSmall" required />
                            </div>
                            <div>
                                <label className='formLabel'>Longitude</label>
                                <input type="number" id="lng" value={lng}  onChange={onMutate} className="formInputSmall" required />
                            </div>
                        </div>
                    )}
                    <label className='formLabel'>Offer</label>
                    <div className="formButtons">
                        <button className={offer ? "formButtonActive" : "formButton"} type="button" id="offer" value={true} onClick={onMutate}>
                            Yes
                        </button>
                        <button className={!offer && offer !== null ? "formButtonActive" : "formButton"} type="button" id="parking" value={false} onClick={onMutate}>
                            No
                        </button>
                    </div>
                    <div>
                        <label className='formLabel'>Regular Price</label>
                        <div className="formPriceDiv">
                            <input type="number" id="regularPrice" value={regularPrice} min="50" max="75000000" onChange={onMutate} className="formInputSmall" required />
                            {type === "rent" && <p className="formPriceText">$ / Month</p>}
                        </div>
                    </div>
                    {offer && (
                        <>
                            <label className='formLabel'>Discounted Price</label>
                            <input type="number" id="discountedPrice" value={discountedPrice} min="150" max="75000000" onChange={onMutate} className="formInputSmall" />
                        </>
                    )}
                    <label className='formLabel'>Images</label>
                    <p className="imagesInfo">The first imge will be the cover (max 6)</p>
                    <input type="file" id="images" max="6" onChange={onMutate} accept=".jpg, .png, .jpeg" className="formInputFile" multiple required />
                    <button type="submit" className="primaryButton createListingButton">Create Listing</button>
                </form>
            </main>
        </div>
    )
}

export default CreateListing