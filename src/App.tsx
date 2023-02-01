import React, { useState, createContext } from "react";
import "./App.css";
import OTPLayout from "./components/OTPLayout";
import Register from "./components/Register";
import { TModal } from "./types";

export const ModalContext = createContext<{modal:TModal,setModal:React.Dispatch<React.SetStateAction<TModal>>|null,generateRandom:()=>number}>({modal:{isOpen:false,otp:0,otpMatch:false},setModal:null,generateRandom:()=>0});

function App() {
  const [modal, setModal] = useState<TModal>({ isOpen: false, otp: 0, otpMatch:false });

    // function to generate a random %  digit number to be used as OTP
    const generateRandom = () => {
      let turn = [0, 0, 0, 0, 0];
      let temp = turn
        .map((ele, i) => {
          // using Math.random to get a random digit
          let num = parseInt((Math.random() * 10).toFixed(0));
          if (i === 0 && num === 0) {
            //using loop to restrict 0 being put on first digit of OTP
            while (num === 0) {
              num = parseInt((Math.random() * 10).toFixed(0));
            }
          }
          // slicing in case Math.random()*10 returns 10
          if (String(num).length > 1) {
            num = parseInt(String(num).slice(0, 1));
          }
          return num;
        })
        .join("");
      return parseInt(temp);
    };

  return (
    <div className="App">
      <ModalContext.Provider value={{modal:modal,setModal:setModal,generateRandom:generateRandom}}>
        <Register />
        <OTPLayout/>
      </ModalContext.Provider>
    </div>
  );
}

export default App;
