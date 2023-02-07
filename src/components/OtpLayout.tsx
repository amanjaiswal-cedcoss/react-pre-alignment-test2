import React, { useEffect, useRef, useState } from "react";
import loader from "../assets/loading.gif";
import { TOtpArr, TModal } from "../types";

type TProps = {
  modal: TModal;
  setModal: React.Dispatch<React.SetStateAction<TModal>>;
  generateRandomOtp: () => number;
  otpArr: TOtpArr;
};

function OtpLayout(props: TProps) {
  const { modal, setModal, generateRandomOtp, otpArr } = props;
  const [state, setState] = useState({
    loading: false,
    attempts: 1,
    otpError: "",
  });
  // separate state for storing previous values of inputs
  const [prevNums, setPrevNums] = useState(otpArr.map((ele) => ""));
  const refNums = useRef<HTMLInputElement[]>([]);
  // separate state for timer
  const [timer, setTimer] = useState({ min: 1, sec: 0 });
  const refResendBtn = useRef<HTMLButtonElement>(null);
  const refInpMsg = useRef<HTMLSpanElement>(null);
  const interval = useRef<ReturnType<typeof setInterval>>();

  // useEffect used for starting timer on initial render,setting focus on input and disabling button
  useEffect(() => {
    interval.current = setInterval(startTimer, 1000);
    setState({ ...state, attempts: state.attempts - 1 });
    refNums.current![0].focus();
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

  const changeHandlerNums = (
    e: React.KeyboardEvent<HTMLInputElement>,
    num: number
  ) => {
    let currentValue = refNums.current![num].value;
    let key = e.key;
    console.log(prevNums[num], currentValue);
    if (currentValue.match(/^[0-9]{1}$/) || currentValue === "") {
      // condition to check for index of ref input to be less than 1 less than refArray length and value be not empty
      if ( key.match(/^[0-9]{1}$/)) {
        if(num < refNums.current.length - 1 ){
          refNums.current![num + 1].focus();
        }
        refNums.current![num].value = key;
      } else if (num > 0 && key === "Backspace") {
        if (prevNums[num] !== currentValue) {
          refNums.current![num - 1].focus();
        } else {
          refNums.current![num - 1].value = "";
          refNums.current![num - 1].focus();
        }
      }

      setPrevNums(refNums.current!.map((ele) => ele.value));
      // using findIndex fn to find if any ref in refArray whose value is empty
      let emptyIndex = refNums.current!.findIndex((ele) => {
        return ele.value === "";
      });
      // condition to check that each input box is filled
      if (emptyIndex === -1) {
        setState({ ...state, loading: true });
        checkOTP();
      } else {
        refNums.current!.forEach((ele) => {
          ele.classList.remove(
            "otpmodal__inpnums--wrng",
            "otpmodal__inpnums--rght"
          );
        });
        setState({ ...state, otpError: "" });
      }
    } else {
      refNums.current![num].value = "";
    }
  };

  // function for validating OTP
  const checkOTP = () => {
    // converting all the values of refArr elements in a number
    let temp = parseInt(refNums.current!.map((ele) => ele.value).join(""));
    // condition to compare input numbers with generated OTP
    if (temp === modal.otp) {
      setState({ ...state, otpError: "", loading: true });
      // to change all input boxes style
      refNums.current!.forEach((ele) => {
        ele.classList.remove("otpmodal__inpnums--wrng");
        ele.classList.add("otpmodal__inpnums--rght");
        ele.blur();
      });
      refInpMsg.current!.textContent='OTP matched successfully.'
      // changing isOpen property which will initiate unmounting the modal
      setTimeout(() => {
        setModal!({ ...modal, isOpen: false });
        setState({ ...state, loading: false });
      }, 1000);
    } else {
      setState({
        ...state,
        otpError: "Entered One-Time-Passcode is incorrect",
        loading: false,
      });
      // to change all input boxes style
      refNums.current!.forEach((ele) => {
        ele.classList.add("otpmodal__inpnums--wrng");
        ele.classList.remove("otpmodal__inpnums--rght");
      });
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
    if (state.attempts !== 0) {
      refNums.current!.forEach((ele, i) => {
        if (i === 0) {
          ele.focus();
        }
        ele.value = "";
        ele.classList.remove("otpmodal__inpnums--wrng");
      });
      setState({ ...state, attempts: state.attempts - 1, otpError: "" });
      setModal!({ ...modal, otp: generateRandomOtp() });
      // setting initial value for timer
      setTimer({ min: 1, sec: 0 });
      refInpMsg.current!.textContent = "One time passcode sent successfully!";
      setTimeout(() => {
        refInpMsg.current!.textContent = "";
      }, 2000);
    } else {
      // message for crossing attempt limit
      setState({ ...state, otpError: "Attempts limit reached." });
    }
  };

  return (
    <div className="otpmodalcover">
      <div className="otpmodal">
        <button
          className="otpmodal__close btn btn--danger"
          onClick={() => {
            setModal && setModal({ ...modal, isOpen: false });
          }}
        >
          X
        </button>
        <div className="otpmodal__header">
          <h3>Verify Email Address({modal.otp})</h3>
        </div>
        <div className="otpmodal__body">
          <h4 className="otpmodal__body__title">Enter your code here:</h4>
          <div>
            <span className="otpmodal__inpgrp">
              {otpArr.map((ele, i) => {
                return (
                  <input
                    key={ele.id}
                    ref={(ref: HTMLInputElement) => {
                      refNums.current[i] = ref;
                    }}
                    onKeyUp={(e) => {
                      changeHandlerNums(e, i);
                    }}
                    // to allow only numbers to be enterred
                    onChange={(e) => {
                      refNums.current![i].value =
                        e.target.value.match(/^[0-9]{1}$/) === null
                          ? ""
                          : e.target.value;
                    }}
                    type="text"
                    maxLength={1}
                    className="otpmodal__inpnums"
                  />
                );
              })}
            </span>
            {state.loading ? (
              <span className="loader">
                <span className="shorttxt">Loading</span>{" "}
                <img className="loader__pic" src={loader} alt="loading gif" />
              </span>
            ) : (
              ""
            )}
          </div>
          <span className="otpmodal__inperror shorttxt">{state.otpError}</span>
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
              <span className="shorttxt">({state.attempts} attempts left)</span>
            </span>
            <span className="otpmodal__timer">
              {/* conditions for adding extra zeroes before single digits in min and sec */}
              {timer.min > 9 ? timer.min : `0${timer.min}`}:
              {timer.sec > 9 ? timer.sec : `0${timer.sec}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtpLayout;