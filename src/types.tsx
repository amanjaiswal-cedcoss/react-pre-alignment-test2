export type TOtpArr={id:number,value:number}[]

export type TModal = {
  isOpen: boolean;
  otp: number;
};

export type TRegisterState = {
  otpCount:number
  otpArr:TOtpArr
};
