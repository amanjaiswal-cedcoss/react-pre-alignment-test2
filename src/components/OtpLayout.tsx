import { useContext, useEffect, useRef, useState } from "react";
import { ModalContext } from "../App";
import loader from "../assets/loading.gif";

function OtpLayout() {
  const refInpNum1 = useRef<HTMLInputElement>(null);
  const refInpNum2 = useRef<HTMLInputElement>(null);
  const refInpNum3 = useRef<HTMLInputElement>(null);
  const refInpNum4 = useRef<HTMLInputElement>(null);
  const refInpNum5 = useRef<HTMLInputElement>(null);
  // array of refs to easily traverse in various functions
  const refArr = [
    { id: 1, ref: refInpNum1 },
    { id: 2, ref: refInpNum2 },
    { id: 3, ref: refInpNum3 },
    { id: 4, ref: refInpNum4 },
    { id: 5, ref: refInpNum5 },
  ];
  // state for error
  const [otpError, setOtpError] = useState("");
  // state for number of attempts
  const [attempts, setAttempts] = useState(refArr.length);
  // state for timer
  const [timer, setTimer] = useState({ min: 1, sec: 0 });
  // state for loading
  const [loading, setLoading] = useState<boolean>(false);
  // refs for resend button
  const refResendBtn = useRef<HTMLButtonElement>(null);
  // ref to change text content of helper span showing messages
  const refInpMsg = useRef<HTMLSpanElement>(null);
  // ref to store interval id
  const interval = useRef<ReturnType<typeof setInterval>>();

  // useContext hook is used for getting values
  const { modal, setModal, generateRandom } = useContext(ModalContext);

  // useEffect used for starting timer on initial render,setting focus on input and disabling button
  useEffect(() => {
    interval.current = setInterval(startTimer, 1000);
    setAttempts((prev) => prev - 1);
    refInpNum1.current!.focus();
    refResendBtn.current!.disabled = true;
    return () => {
      clearInterval(interval.current);
    };
  }, []);

  // function for countdown timer calculation
  const startTimer = () => {
    if (timer.min === 0 && timer.sec === 0) {
      clearInterval(interval.current);
      refResendBtn.current!.disabled = false;
      refResendBtn.current!.classList.remove("btn--disabled");
    } else if (timer.sec === 0) {
      timer.min--;
      // initializing timer seconds calue to 59 when reached 0
      timer.sec = 59;
    } else if (timer.sec <= 59) {
      timer.sec--;
    }
    setTimer({ ...timer });
  };

  const changeHandlerNums = (num: number) => {
    refArr[num].ref.current!.value = refArr[num].ref.current!.value.slice(0, 1);
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

    // condition to check that each input box is filled
    if (emptyIndex === -1) {
      setLoading(true);
      checkOTP();
    } else {
      refArr.forEach((ele) => {
        ele.ref.current!.classList.remove("otpmodal__inpnums--wrng");
        ele.ref.current!.classList.remove("otpmodal__inpnums--rght");
      });
      setOtpError("");
    }
  };

  // function for validating OTP
  const checkOTP = () => {
    // converting all the values of refArr elements in a number
    let temp = parseInt(refArr.map((ele) => ele.ref.current!.value).join(""));
    // condition to compare input numbers with generated OTP
    if (temp === modal.otp) {
      // to empty error message
      setOtpError("");
      // to change all input boxes style
      refArr.forEach((ele) => {
        ele.ref.current!.classList.remove("otpmodal__inpnums--wrng");
        ele.ref.current!.classList.add("otpmodal__inpnums--rght");
      });
      // changing isOpen property which will initiate unmounting the modal
      setTimeout(() => {
        setModal!({ ...modal, isOpen: false });
        setLoading(false);
      }, 1000);
    } else {
      // to show error message
      setOtpError("Entered One-Time-Passcode is incorrect");
      // to change all input boxes style
      refArr.forEach((ele) => {
        ele.ref.current!.classList.add("otpmodal__inpnums--wrng");
        ele.ref.current!.classList.remove("otpmodal__inpnums--rght");
      });
      setLoading(false);
    }
  };

  // useEffect used to clear preious interval and start a new one
  useEffect(() => {
    if (timer.min === 1 && timer.sec === 0) {
      clearInterval(interval.current);
      interval.current = setInterval(startTimer, 1000);
    }
  }, [timer]);

  // function to change attempts,call generate fn and restart the timer
  const resendOTP = () => {
    // disabling resend button
    refResendBtn.current!.disabled = true;
    refResendBtn.current!.classList.add("btn--disabled");
    if (attempts !== 0) {
      setAttempts((prev) => prev - 1);
      setModal!({ ...modal, otp: generateRandom() });
      // setting initial value for timer
      setTimer({ min: 1, sec: 0 });
      // message shown of successful generation of OTP
      refInpMsg.current!.textContent = "One time passcode sent successfully!";
      // removing the above message after 2 seconds
      setTimeout(() => {
        refInpMsg.current!.textContent = "";
      }, 2000);
    } else {
      // message for crossing attempt limit
      setOtpError("Attempts limit reached.");
    }
  };

  return (
    <div className="otpmodalcover">
      <div className="otpmodal">
        {/* using ! to explicitly tell that setModal action is not null in onclick fn oof below button */}
        <button
          className="otpmodal__close btn btn--danger"
          onClick={() => {
            setModal && setModal({ ...modal, isOpen: false });
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
          <span className="otpmodal__inpmsg shorttxt" ref={refInpMsg}></span>
          <div className="otpmodal__inphelp">
            <span>
              <button
                className="btn btn--link btn--disabled"
                onClick={resendOTP}
                ref={refResendBtn}
              >
                Resend One-time passcode
              </button>
              <span className="shorttxt">({attempts} attempts left)</span>
            </span>
            <span className="otpmodal__timer">
              {/* conditions for adding extra zeroes before single digits in min and sec */}
              {timer.min > 10 ? timer.min : `0${timer.min}`}:
              {timer.sec > 10 ? timer.sec : `0${timer.sec}`}
            </span>
          </div>
          {loading ? (
            <div className="loader">
              <span className="shorttxt">Loading</span>{" "}
              <img className="loader__pic" src={loader} alt="loading gif" />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default OtpLayout;
