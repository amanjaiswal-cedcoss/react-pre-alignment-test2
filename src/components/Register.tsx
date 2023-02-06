import { useRef, useState } from "react";
import { TRegisterState } from "../types";
import OtpLayout from "./OtpLayout";

function Register() {
  const refOtpDigits = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<TRegisterState>({
    otpCount: 5,
    otpArr:[],
  });
  const [info,setInfo]=useState({ type: "", message: "" })
  const [modal, setModal] = useState({ isOpen: false, otp: 0 });

  // function to generate a random %  digit number to be used as OTP
  const generateRandomOtp = () => {
    let temp:number[] = [];
    for (let i = 0; i < state.otpCount; i++) {
       // using Math.random to get a random digit
       let num= parseInt((Math.random() * 10).toFixed(0));
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
      temp.push(num);
    }
    console.log(temp)
    setState({...state,otpArr:[...temp]})
    return parseInt(temp.join(''));
  };

  const validateOtp = () => {
    // checking for null values required because type defined
      setModal({ ...modal, isOpen: true, otp: generateRandomOtp() });
  };

  const saveOtpCount = () => {
    if (refOtpDigits.current!.value.match(/^[4-8]{1}$/)) {
      setModal({ ...modal, otp: generateRandomOtp() });
      setInfo({...info,type:'alert--successful',message:'Number of OTP digits submitted successfully.'})
      setState({...state,otpCount:parseInt(refOtpDigits.current!.value)})
      refOtpDigits.current!.value='';
      setTimeout(()=>{
        setInfo({...info,message:''})
      },2000)
    } else {
      setInfo({...info,type:'alert--error',message:'Please enter a number between 4-8'})
    }

  };

  return (
    <>
      <div>
        <h2>Register</h2>
        <button className="btn btn--primary" onClick={validateOtp}>
          Validate OTP
        </button>
      </div>
      <div className="box">
        <label className="shorttxt">Enter number of digits for OTP(Limit:4-8)</label>
        <input
          type="text"
          pattern="^\d+$"
          placeholder={state.otpCount.toFixed()}
          maxLength={1}
          ref={refOtpDigits}/>
          <button className="btn btn--primary" onClick={saveOtpCount}>Submit</button>
        {info.message !== "" && (
          <span className={`alert ${info.type}`}>
            {info.message}
          </span>
        )}
      </div>
      {modal.isOpen ? <OtpLayout modal={modal} setModal={setModal} generateRandomOtp={generateRandomOtp} otpArr={state.otpArr}/> : ""}
    </>
  );
}

export default Register;
