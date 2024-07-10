import React, { useEffect, useState } from "react";
import '../components/Home/home.scss'
import Header from "../components/Header/Header";

export default function Home() {


    return (

        <section className="bg-home">
            <div className="container">
                <Header/>
                <div className="row mt-5">
                    <div className="col-md-12">
                        <h5>Home page content</h5>
                    </div>
                </div>
            </div>
        </section>

    )
}