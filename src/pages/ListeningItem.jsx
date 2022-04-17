import { Link } from "react-router-dom"
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";
import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";

function ListeningItem({ listening, id, onDelete,onEdit }) {
    console.log(listening)
    return (
        <li className="categoryListing">
            <Link to={`category/${listening.type}/${id}`} className="categoryListingLink">
                <img src={listening.imgUrls} alt={listening.name} className="categoryListingImg" />
                <div className="categoryListingDetails">
                  <p className="categoryListingLocation">
                  {listening.location}
                  </p>
                  <p className="categoryListingName"> {listening.name}</p>
                  <p className="categoryListingPrice">
                      ${listening.offer ? listening.discountedPrice : listening.regularPrice }
                      {listening.type==="rent" && " / Month"}
                  </p>
                  <div className="categoryListingInfoDiv">
                      <img src={bedIcon} alt="bed" />
                      <p className="categoryListingInfoText">
                          {listening.bedrooms>1 ? `${listening.bedrooms} Bedrooms` : `1 Bedroom`}
                      </p>
                      <img src={bathtubIcon} alt="bath" />
                      <p className="categoryListingInfoText">
                          {listening.bathrooms>1 ? `${listening.bathrooms} Bathrooms` : `1 Bathroom`}
                      </p>
                  </div>
                </div>
            </Link>
            {onDelete && (
                <DeleteIcon className="removeIcon" fill="#red" onClick={()=>onDelete(listening.id, listening.name)}/>
            )}
            {onEdit && ( 
                <EditIcon className="editIcon" onClick={()=>onEdit(id)}/>
            )}
        </li>
    )
}

export default ListeningItem