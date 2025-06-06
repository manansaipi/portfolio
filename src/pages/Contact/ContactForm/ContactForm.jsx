import React, { useRef, useState } from "react";
import emailjs, { send } from "emailjs-com";
import { MdMailOutline } from "react-icons/md";
import Magnet from "../../../components/Magnet";
import { FaCheck } from "react-icons/fa";
import Lottie from "lottie-react";
import checkAnimation from "../../../assets/animations/icons8-check.json"; // your downloaded file
import { validateContactForm } from "./ValidatContactForm";
import ContactInputComponent from "./ContactInputComponent";
const ContactForm = () => {
    let form = useRef();

    // Refs for inputs
    const nameRef = useRef();
    const emailRef = useRef();
    const subjectRef = useRef();
    const messageRef = useRef();

    // Refs for error messages
    const nameErrorRef = useRef();
    const emailErrorRef = useRef();
    const subjectErrorRef = useRef();
    const messageErrorRef = useRef();

    const [isLoading, setIsLoading] = useState();
    const [isSuccess, setIsSuccess] = useState();

    const sendEmail = (e) => {
        e.preventDefault();

        const isValid = validateContactForm({
            nameRef,
            emailRef,
            subjectRef,
            messageRef,
            nameErrorRef,
            emailErrorRef,
            subjectErrorRef,
            messageErrorRef,
            form,
        });

        if (!isValid) return;

        setIsLoading(true);
        setIsSuccess(false);
        emailjs
            .sendForm(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                form.current,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            )

            .then(
                (result) => {
                    form.current.reset(); // clear the form
                },
                (error) => {
                    alert("Failed to send message. Please try again.");
                    console.error(error.text);
                }
            )
            .finally(() => {
                setIsLoading(false);
                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false);
                }, 1200);
            });

        // setTimeout(() => {
        //     setIsLoading(false);
        //     setIsSuccess(true);
        //     setTimeout(() => {
        //         setIsSuccess(false);
        //     }, 1200);
        // }, 1000);
    };

    return (
        <div>
            <form ref={form} onSubmit={sendEmail} noValidate>
                <div className="flex flex-col gap-y-5 md:gap-y-5 textmd md:text-xl font-semibold ">
                    <ContactInputComponent
                        inputRef={nameRef}
                        errorRef={nameErrorRef}
                        name="name"
                        placeholder="Your Name"
                    />
                    <ContactInputComponent
                        inputRef={emailRef}
                        errorRef={emailErrorRef}
                        name="email"
                        type="email"
                        placeholder="Your Email"
                    />
                    <ContactInputComponent
                        inputRef={subjectRef}
                        errorRef={subjectErrorRef}
                        name="subject"
                        placeholder="Subject"
                        defaultValue={"Hay Ben"}
                        className={"hidden"}
                    />
                    <ContactInputComponent
                        inputRef={messageRef}
                        errorRef={messageErrorRef}
                        name="message"
                        placeholder="Your Message"
                        isTextArea={true}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex justify-center items-center border px-8 py-1 text-lg md:text-xl rounded-xm cursor-none hover:border-color-text-hovering  mt-5 rounded-md active:bg-color-text-hovering transition-all duration-700 ${
                        isLoading ? "opacity-60 cursor-not-allowed" : ""
                    } ${
                        isSuccess
                            ? "border-green-500 text-green-500"
                            : "text-primary"
                    } `}
                >
                    <Magnet magnetStrength={3} padding={5}>
                        <a className="flex flex-row gap-2 items-center justify-center ">
                            {isLoading ? (
                                <div className="text-primary animate-pulse">
                                    Sending...
                                </div>
                            ) : isSuccess ? (
                                <>
                                    <Lottie
                                        animationData={checkAnimation}
                                        color="00ff00"
                                        style={{ width: 22, height: 22 }}
                                    />
                                    <div>Sent</div>
                                </>
                            ) : (
                                <>
                                    <MdMailOutline
                                        className="pointer-events-none"
                                        size={27}
                                    />
                                    <div className="pointer-events-none">
                                        Send
                                    </div>
                                </>
                            )}
                        </a>
                    </Magnet>
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
