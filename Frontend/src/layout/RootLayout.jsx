import HomePage from '@/components/HomePage';
import Footer from '@/share/Footer';
import Header from '@/share/Header';
import React from 'react'
import { Outlet} from "react-router-dom";
function RootLayout() {
  return (
    <div className="bg-gray-100 pt-[100px]">
        <Header/>
        <section>
        <Outlet/> 
        </section>
        <Footer/>

    </div>
  )
}

export default RootLayout