import { useContext, useEffect, useRef, useState } from "react";
import { ModalContext } from "../App";

function OTPLayout() {
  const refInpNum1 = useRef<HTMLInputElement>(null);
  const refInpNum2 = useRef<HTMLInputElement>(null);
  const refInpNum3 = useRef<HTMLInputElement>(null);
  const refInpNum4 = useRef<HTMLInputElement>(null);
  const refInpNum5 = useRef<HTMLInputElement>(null);
  const refArr = [
    { id: 1, ref: refInpNum1 },
    { id: 2, ref: refInpNum2 },
    { id: 3, ref: refInpNum3 },
    { id: 4, ref: refInpNum4 },
    { id: 5, ref: refInpNum5 },
  ];
  const [otpError, setOtpError] = useState("");
  const [attempts, setAttempts] = useState(refArr.length);
  const [timer, setTimer] = useState({ min: 0, sec: 10 });
  const refResendBtn = useRef<HTMLButtonElement>(null);
  const interval=useRef<any>();

  const { modal, setModal, generateRandom } = useContext(ModalContext);


  useEffect(() => {
    startTimer();
  }, []);

  const startTimer = () => {
    console.log('timer started')
    interval.current=setInterval(() => {
      if(timer.min===0 && timer.sec===0){
        clearInterval(interval.current)
        // refResendBtn.current!.disabled = false;
        // refResendBtn.current!.classList.remove("btn--disabled");
      }
      else if (timer.sec === 0) {
        timer.min--;
        timer.sec = 59;
      }
      else if (timer.sec <= 59) {
        timer.sec--;
      }      
      setTimer({ ...timer });
    }, 1000);
  };

  const changeHandlerNums = (num: number) => {
    // condition to check for index of ref input to be less than 4 and value be not empty
    if (num < 4 && refArr && refArr[num].ref.current!.value !== "") {
      refArr[num + 1].ref.current!.focus();
      // condition to check for index of ref input to be greater than 0 and value be empty
    } else if (num > 0 && refArr && refArr[num].ref.current!.value === "") {
      refArr[num - 1].ref.current!.focus();
    }
    // using findIndex fn to find if any ref in refArray whose value is empty
    let emptyIndex = refArr.findIndex((ele) => {
      return ele.ref.current!.value === "";
    });
    if (emptyIndex === -1) {
      checkOTP();
    }
  };

  const checkOTP = () => {
    let temp = parseInt(refArr.map((ele) => ele.ref.current!.value).join(""));
    if (temp === modal.otp) {
      setOtpError("");
      refArr.forEach((ele) => {
        ele.ref.current!.classList.remove("otpmodal__inpnums--wrng");
        ele.ref.current!.classList.add("otpmodal__inpnums--rght");
      });
    } else {
      setOtpError("Entered One-Time-Passcode is incorrect");
      refArr.forEach((ele) => {
        ele.ref.current!.classList.add("otpmodal__inpnums--wrng");
        ele.ref.current!.classList.remove("otpmodal__inpnums--rght");
      });
    }
  };

  const resendOTP = () => {
    // setAttempts((prev) => prev - 1);
    // setModal!({ ...modal, otp: generateRandom() });
    // refResendBtn.current!.disabled = true;
    // refResendBtn.current!.classList.add("btn--disabled");
    setTimer({min:5,sec:0})
    clearInterval(interval.current)
    startTimer();
  };

  return (
    <div className="otpmodal">
      {/* using ! to explicitly tell that setModal action is not null in onclick fn oof below button */}
      <button
        className="otpmodal__close btn btn--danger"
        onClick={() => {
          setModal!({ ...modal, isOpen: false });
        }}
      >
        X
      </button>
      <div className="otpmodal__header">
        <h3>Verify Email Address ({modal.otp})</h3>
      </div>
      <div className="otpmodal__body">
        <h5 className="otp__modal__body__title">Enter your code here:</h5>
        <span className="otpmodal__inpgrp">
          {refArr.map((ele, i) => {
            return (
              <input
                key={ele.id}
                ref={ele.ref}
                onChange={() => {
                  changeHandlerNums(i);
                }}
                type="number"
                className="otpmodal__inpnums"
              />
            );
          })}
        </span>
        <span className="otpmodal__inperror shorttxt">{otpError}</span>
        <div className="otpmodal__inphelp">
          <span>
            <button
              className="btn btn--link"
              onClick={resendOTP}
              ref={refResendBtn}
              // disabled
            >
              Resend One-time passcode
            </button>
            <span className="shorttxt">({attempts} attempts left)</span>
          </span>
          <span className="otpmodal__timer">
            {timer.min}:{timer.sec}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OTPLayout;
