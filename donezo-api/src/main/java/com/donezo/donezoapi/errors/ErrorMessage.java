package com.donezo.donezoapi.errors;

import lombok.Getter;

@Getter
public class ErrorMessage {

        private final int status;
        private final String message;
        private final String description;

        public ErrorMessage(int status, String message,
                            String description) {

            this.status = status;
            this.message = message;
            this.description = description;
        }
}
