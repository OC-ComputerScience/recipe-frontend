export const getDomainUrl = () => {
    return "http://ec2-3-145-163-72.us-east-2.compute.amazonaws.com"
}

export const getSnackBar = (text,color="error") => {
    var snackbar = {}
    snackbar.value = true;
    snackbar.color = color;
    snackbar.text = text;
    return snackbar;
}