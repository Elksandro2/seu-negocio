export function formatFieldErrors(responseData) {
    if (responseData?.fieldMessageList && Array.isArray(responseData.fieldMessageList)) {
        const fieldErrorMessages = responseData.fieldMessageList
            .map(fieldError => `- ${fieldError.message}`)
            .join('\n');
        
        return `${responseData.message || "Campos inválidos"}:\n${fieldErrorMessages}`;
    }

    if (responseData?.message) {
        return responseData.message;
    }

    return "Erro inesperado. Verifique a conexão ou tente novamente.";
}