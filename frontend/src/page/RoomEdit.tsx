import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { Cage, UploadRes } from "@/types/response";
import { UpdateCage } from "@/helper/cage";
import UploadImage from "@/components/UploadImage";
import FormEditHotel from "@/components/Hotel-Edit/FormEditHotel";


const RoomDetailPage = () => {


    const navigate = useNavigate();






    return (
        <div className="bg-bg">
            <div className="flex justify-center pb-10">
                <div className="flex w-3/4 items-center flex-col gap-y-2">
                    {/* section1 */}
                    <div className="pt-10 space-x-1">
                        <button
                            className="bg-egg h-10 w-20 rounded-md text-navbar"
                            onClick={() => navigate('/hotelhome')}
                        >view
                        </button>
                        <button className="bg-navbar h-10 w-20 rounded-md text-white">edit</button>
                    </div>
                </div>
            </div>
            <FormEditHotel />
        </div>
    );
};

export default RoomDetailPage;
