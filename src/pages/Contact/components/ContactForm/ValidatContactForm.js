export const validateContactForm = ({
    nameRef,
    emailRef,
    subjectRef,
    messageRef,
    nameErrorRef,
    emailErrorRef,
    subjectErrorRef,
    messageErrorRef,
    form,
}) => {
    const name = form.current.name.value.trim();
    const email = form.current.email.value.trim();
    const subject = form.current.subject.value.trim();
    const message = form.current.message.value.trim();

    let isValid = true;

    const showError = (inputRef, errorRef, message) => {
        inputRef.current.classList.add("border-red-400");
        errorRef.current.textContent = message;
        if (errorRef.current.classList.contains("opacity-0")) {
            errorRef.current.classList.replace("opacity-0", "opacity-100");
        } else {
            errorRef.current.classList.add("opacity-100");
        }
    };

    const hideError = (inputRef, errorRef) => {
        inputRef.current.classList.remove("border-red-400");
        errorRef.current.textContent = "";
        errorRef.current.classList.replace("opacity-100", "opacity-0");
    };

    if (!name) {
        showError(nameRef, nameErrorRef, "Please enter your name.");
        isValid = false;
    } else {
        hideError(nameRef, nameErrorRef);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showError(
            emailRef,
            emailErrorRef,
            !email
                ? "Please enter your email."
                : "Please enter a valid email address."
        );
        isValid = false;
    } else {
        hideError(emailRef, emailErrorRef);
    }

    if (!subject) {
        showError(subjectRef, subjectErrorRef, "Please enter a subject.");
        isValid = false;
    } else {
        hideError(subjectRef, subjectErrorRef);
    }

    if (!message) {
        showError(messageRef, messageErrorRef, "Please enter a message.");
        isValid = false;
    } else {
        hideError(messageRef, messageErrorRef);
    }

    return isValid;
};
