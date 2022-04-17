import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getDoc, doc } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { db } from "../firabase.config"
import Spinner from "../components/Spinner"
import shareIcon from "../assets/svg/shareIcon.svg"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/swiper-bundle.css"
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])
function SingleListing() {
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(false)
    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, "listenings", params.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setListing(docSnap.data())
                setLoading(false)
            }
        }
        fetchListing()
    }, [params.id, navigate])

    if (loading) {
        return <Spinner />
    }
    return (
        <main>
            <Swiper slidesPerView={1} pagination={{ clickable: true }}>
                {listing.imgUrls.map((url, index) => (
                    <SwiperSlide key={index} >
                        <div style={{ background: `url(${listing.imgUrls[index]}) center no-repeat`, backgroundSize:"cover" }} className="swiper-wrapper">
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="shareIconDiv" onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                setShareLinkCopied(true)
                setTimeout(() => {
                    setShareLinkCopied(false)
                }, 2000)
            }}>
                <img src={shareIcon} alt="" />
            </div>
            {shareLinkCopied && <p className="linkCopied">The link copied</p>}
            <div className="listingDetails">
                <p className="listingName">
                    {listing.name} - ${listing.offer ? listing.discountedPrice : listing.regularPrice}
                </p>
                <p className="listingLocation">{listing.location}</p>
                <p className="listingType">
                    For {listing.type === "rent" ? "Rent" : "Sale"}
                </p>
                {listing.offer && (
                    <p className="discountPrice">
                        ${listing.regularPrice - listing.discountedPrice} discount
                    </p>
                )}
                <ul className="listingDetailsList">
                    <li>
                        {listing.bedrooms > 1 ? `${listing.bedrooms} bedrooms` : "1 bedroom"}
                    </li>
                    <li>
                        {listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms` : "1 bathrooms"}
                    </li>
                    <li>{listing.parking && "Parking spot"}</li>
                    <li>{listing.furnished && "Furnished"}</li>
                </ul>
                <p className="listingLocationTitle">Location</p>
                {/* Map describe */}
                <div className="leafletContainer">
                    <MapContainer style={{ height: "100%", width: "100%" }}
                        center={[listing.lat, listing.lng]} zoom={13} scrollWheelZoom={false}>
                        <TileLayer
                            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[listing.lat, listing.lng]}>
                            <Popup>{listing.location}</Popup>
                        </Marker>
                    </MapContainer>
                </div>
                {auth.currentUser?.uid !== listing.useRef && (<Link to={`/contact/${listing.useRef}?listingName=${listing.name}`} className="primaryButton">Contact Landlord</Link>)}
            </div>

        </main>
        //Slider

    )
}

export default SingleListing