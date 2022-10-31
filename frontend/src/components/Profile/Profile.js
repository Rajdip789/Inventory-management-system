import React from 'react'
import './Profile.scss'

import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
// import { useState } from "react";

const inputs = [
    { id: 1, label: "Name", type: "text", placeholder: "name " },
    { id: 2, label: "Address", type: "text", placeholder: "address " },
    { id: 3, label: "Email", type: "text", placeholder: "email " },
];
function Profile() {  //{ inputs, title }
    // const [file, setFile] = useState("");

    return (
        <div className='profile'>
            <div className="bottom">
                <div className="left">
                    <img
                        // src={
                        //     file
                        //         ? URL.createObjectURL(file)
                        //         : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                        // }
                        alt=""
                    />
                </div>
                <div className="right">
                    <form>
                        <div className="formInput">
                            <label htmlFor="file">
                                Image: <DriveFolderUploadOutlinedIcon className="icon" />
                            </label>
                            <input
                                type="file"
                                id="file"
                                // onChange={(e) => setFile(e.target.files[0])}
                                style={{ display: "none" }}
                            />
                        </div>

                        {inputs.map((input) => (
                            <div className="formInput" key={input.id}>
                                <label>{input.label}</label>
                                <input type={input.type} placeholder={input.placeholder} />
                            </div>
                        ))}
                        <button>Edit</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile
