// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`CLI Should generate accesso api: code 1`] = `
"// Accesso App Public API. 0.3.0
// --- 
// This file is automatically generated by swagger-to-js with preset @sergeysova/swagger-to-js-preset
// Do not edit this file directly. Instead open swagger-to-js config file and follow the link in \\"file\\"

import { createEffect } from 'effector-root';
import * as typed from 'typed-contracts
import { requestFx } from './request';

const custom = { any: (valueName: string, value: mixed): any => value }

/*
{
  \\"operationId\\": \\"oauthAuthorizeRequest\\",
  \\"tags\\": [
    \\"OAuth\\"
  ],
  \\"description\\": \\"Authorization request\\",
  \\"requestBody\\": {
    \\"required\\": true,
    \\"content\\": {
      \\"application/json\\": {
        \\"schema\\": {
          \\"type\\": \\"object\\",
          \\"required\\": [
            \\"responseType\\",
            \\"clientId\\",
            \\"redirectUri\\"
          ],
          \\"properties\\": {
            \\"responseType\\": {
              \\"description\\": \\"responseType is set to code indicating that you want an authorization code as the response.\\",
              \\"type\\": \\"string\\",
              \\"enum\\": [
                \\"code\\"
              ]
            },
            \\"clientId\\": {
              \\"description\\": \\"The clientId is the identifier for your app. You will have received a clientId when first registering your app with the service.\\",
              \\"type\\": \\"string\\",
              \\"format\\": \\"uuid\\",
              \\"example\\": \\"41190cee-5231-4dcc-8167-ebf798b55ce3\\"
            },
            \\"redirectUri\\": {
              \\"description\\": \\"The redirectUri may be optional depending on the API, but is highly recommended.<br/>\\\\nThis is the URL to which you want the user to be redirected after the authorization is complete.<br/>\\\\nThis must match the redirect URL that you have previously registered with the service.<br/>\\\\n\\",
              \\"type\\": \\"string\\",
              \\"format\\": \\"uri\\",
              \\"example\\": \\"https://example-app.com/oauth/callback\\"
            },
            \\"scope\\": {
              \\"description\\": \\"Include one or more scope values (space-separated) to request additional levels of access.<br/>\\",
              \\"type\\": \\"string\\",
              \\"example\\": \\"user:view user:edit\\"
            },
            \\"state\\": {
              \\"description\\": \\"The state parameter serves two functions.<br/> When the user is redirected back to your app, whatever value you include as the state will also be included in the redirect.<br/> This gives your app a chance to persist data between the user being directed to the authorization server and back again, such as using the state parameter as a session key. This may be used to indicate what action in the app to perform after authorization is complete, for example, indicating which of your app’s pages to redirect to after authorization. This also serves as a CSRF protection mechanism.<br/> When the user is redirected back to your app, double check that the state value matches what you set it to originally. This will ensure an attacker can’t intercept the authorization flow.\\",
              \\"type\\": \\"string\\"
            }
          }
        }
      }
    }
  },
  \\"responses\\": {
    \\"200\\": {
      \\"description\\": \\"Authorization completed, now access token can be obtained.\\",
      \\"content\\": {
        \\"application/json\\": {
          \\"schema\\": {
            \\"type\\": \\"object\\",
            \\"required\\": [
              \\"redirectUri\\",
              \\"code\\"
            ],
            \\"properties\\": {
              \\"redirectUri\\": {
                \\"description\\": \\"User should be redirected to\\",
                \\"type\\": \\"string\\",
                \\"format\\": \\"url\\"
              },
              \\"code\\": {
                \\"description\\": \\"This parameter contains the authorization code which the client will later exchange for an access token.\\",
                \\"type\\": \\"string\\"
              },
              \\"state\\": {
                \\"description\\": \\"If the initial request contained a state parameter, the response must also include the exact value from the request. The client will be using this to associate this response with the initial request.\\",
                \\"type\\": \\"string\\"
              }
            }
          }
        }
      }
    },
    \\"400\\": {
      \\"description\\": \\"There are two different kinds of errors to handle. The first kind of error is when the developer did something wrong when creating the authorization request. The other kind of error is when the user rejects the request (clicks the “Deny” button). <br/> If there is something wrong with the syntax of the request, such as the redirect_uri or client_id is invalid, then it’s important not to redirect the user and instead you should show the error message directly. This is to avoid letting your authorization server be used as an open redirector. <br/> If the redirect_uri and client_id are both valid, but there is still some other problem, it’s okay to redirect the user back to the redirect URI with the error in the query string.\\",
      \\"content\\": {
        \\"application/json\\": {
          \\"schema\\": {
            \\"type\\": \\"object\\",
            \\"required\\": [
              \\"error\\"
            ],
            \\"properties\\": {
              \\"error\\": {
                \\"description\\": \\"Possible errors: <br/>\\\\nIf the user denies the authorization request, the server will redirect the user back to the redirect URL with error=\`access_denied\` in the query string, and no code will be present. It is up to the app to decide what to display to the user at this point.<br/>\\\\n\`invalid_request\` — The request is missing a required parameter, includes an invalid parameter value, or is otherwise malformed.<br/>\\\\n\`unsupported_response_type\` — The authorization server does not support obtaining an authorization code using this method.<br/>\\\\n\`invalid_scope\` — The requested scope is invalid, unknown, or malformed.<br/>\\\\n\`server_error\` — The authorization server encountered an unexpected condition which prevented it from fulfilling the request.<br/>\\\\n\`temporarily_unavailable\` — The authorization server is currently unable to handle the request due to a temporary overloading or maintenance of the server.<br/>\\\\n[OAuth2 Possible Errors](https://www.oauth.com/oauth2-servers/server-side-apps/possible-errors/)\\\\n\\",
                \\"type\\": \\"string\\",
                \\"enum\\": [
                  \\"access_denied\\",
                  \\"invalid_request\\",
                  \\"invalid_scope\\",
                  \\"server_error\\",
                  \\"temporarily_unavailable\\",
                  \\"unauthenticated_user\\",
                  \\"unauthorized_client\\",
                  \\"unsupported_response_type\\"
                ]
              },
              \\"redirectUri\\": {
                \\"description\\": \\"User should be redirected to if passed redirectUri and clientId is correct\\",
                \\"type\\": \\"string\\",
                \\"format\\": \\"url\\"
              },
              \\"state\\": {
                \\"description\\": \\"If the initial request contained a state parameter, the response must also include the exact value from the request. The client will be using this to associate this response with the initial request.\\",
                \\"type\\": \\"string\\"
              }
            }
          }
        }
      }
    },
    \\"500\\": {
      \\"description\\": \\"Something goes wrong\\"
    }
  }
}
*/

const TOauthAuthorizeRequestBody = typed.object({
  // responseType is set to code indicating that you want an authorization code as the response.
  responseType: type.union('code',),
  // The clientId is the identifier for your app. You will have received a clientId when first registering your app with the service.
  clientId: type.string,
  // The redirectUri may be optional depending on the API, but is highly recommended.<br/>
  // This is the URL to which you want the user to be redirected after the authorization is complete.<br/>
  // This must match the redirect URL that you have previously registered with the service.<br/>
  redirectUri: type.string,
  // Include one or more scope values (space-separated) to request additional levels of access.<br/>
  scope: type.string.maybe,
  // The state parameter serves two functions.<br/> When the user is redirected back to your app, whatever value you include as the state will also be included in the redirect.<br/> This gives your app a chance to persist data between the user being directed to the authorization server and back again, such as using the state parameter as a session key. This may be used to indicate what action in the app to perform after authorization is complete, for example, indicating which of your app’s pages to redirect to after authorization. This also serves as a CSRF protection mechanism.<br/> When the user is redirected back to your app, double check that the state value matches what you set it to originally. This will ensure an attacker can’t intercept the authorization flow.
  state: type.string.maybe,
})
export type OauthAuthorizeRequestBody = typed.Get<typeof typed.object({
  // responseType is set to code indicating that you want an authorization code as the response.
  responseType: type.union('code',),
  // The clientId is the identifier for your app. You will have received a clientId when first registering your app with the service.
  clientId: type.string,
  // The redirectUri may be optional depending on the API, but is highly recommended.<br/>
  // This is the URL to which you want the user to be redirected after the authorization is complete.<br/>
  // This must match the redirect URL that you have previously registered with the service.<br/>
  redirectUri: type.string,
  // Include one or more scope values (space-separated) to request additional levels of access.<br/>
  scope: type.string.maybe,
  // The state parameter serves two functions.<br/> When the user is redirected back to your app, whatever value you include as the state will also be included in the redirect.<br/> This gives your app a chance to persist data between the user being directed to the authorization server and back again, such as using the state parameter as a session key. This may be used to indicate what action in the app to perform after authorization is complete, for example, indicating which of your app’s pages to redirect to after authorization. This also serves as a CSRF protection mechanism.<br/> When the user is redirected back to your app, double check that the state value matches what you set it to originally. This will ensure an attacker can’t intercept the authorization flow.
  state: type.string.maybe,
})>;

const TOauthAuthorizeRequestDone = {{CONTRACT_DONE}};
export type OauthAuthorizeRequestDone = typed.Get<typeof TOauthAuthorizeRequestDone>;

const TOauthAuthorizeRequestFail = {{CONTRACT_FAIL}};
export type OauthAuthorizeRequestFail = typed.Get<typeof TOauthAuthorizeRequestFail>;

/** Authorization request */
export const oauthAuthorizeRequestFx = createEffect<OauthAuthorizeRequest, OauthAuthorizeRequestDone, OauthAuthorizeRequestFail>({
  async handler(params) {
    const result = await requestFx({
      method: \\"POST\\",
      path: \\"/oauth/authorize\\",
      body: params,
    });
    return result.body as OauthAuthorizeRequestDone;
  }
});

/*
{
  \\"operationId\\": \\"oauthToken\\",
  \\"tags\\": [
    \\"OAuth\\"
  ],
  \\"description\\": \\"Exchange the authorization code for an access token\\",
  \\"requestBody\\": {
    \\"required\\": true,
    \\"content\\": {
      \\"application/json\\": {
        \\"schema\\": {
          \\"type\\": \\"object\\",
          \\"required\\": [
            \\"grant_type\\",
            \\"code\\",
            \\"redirect_uri\\",
            \\"client_id\\",
            \\"client_secret\\"
          ],
          \\"properties\\": {
            \\"grant_type\\": {
              \\"type\\": \\"string\\",
              \\"enum\\": [
                \\"authorization_code\\"
              ]
            },
            \\"code\\": {
              \\"type\\": \\"string\\",
              \\"description\\": \\"This parameter is for the authorization code received from the authorization server which will be in the query string parameter “code” in this request.\\"
            },
            \\"redirect_uri\\": {
              \\"type\\": \\"string\\",
              \\"format\\": \\"uri\\",
              \\"example\\": \\"https://example-app.com/oauth/callback\\",
              \\"description\\": \\"If the redirect URL was included in the initial authorization request,<br/> it must be included in the token request as well, and must be identical.<br/> Some services support registering multiple redirect URLs, and some require the redirect URL to be specified on each request.<br/>\\"
            },
            \\"client_id\\": {
              \\"type\\": \\"string\\"
            },
            \\"client_secret\\": {
              \\"type\\": \\"string\\"
            }
          }
        }
      }
    }
  },
  \\"responses\\": {
    \\"201\\": {
      \\"description\\": \\"The auth services validated the request and responds with an access token [OAuth2 Example Flow](https://www.oauth.com/oauth2-servers/server-side-apps/example-flow/)\\",
      \\"content\\": {
        \\"application/json\\": {
          \\"schema\\": {
            \\"type\\": \\"object\\",
            \\"required\\": [
              \\"access_token\\",
              \\"token_type\\",
              \\"expires\\"
            ],
            \\"properties\\": {
              \\"access_token\\": {
                \\"type\\": \\"string\\"
              },
              \\"token_type\\": {
                \\"type\\": \\"string\\",
                \\"enum\\": [
                  \\"bearer\\"
                ]
              },
              \\"expires_in\\": {
                \\"type\\": \\"integer\\",
                \\"format\\": \\"int32\\",
                \\"description\\": \\"UTC Unix TimeStamp when the access token expires\\"
              }
            }
          }
        }
      }
    },
    \\"400\\": {
      \\"description\\": \\"When you can't exchange authorization code to access token\\",
      \\"content\\": {
        \\"application/json\\": {
          \\"schema\\": {
            \\"type\\": \\"object\\",
            \\"required\\": [
              \\"error\\"
            ],
            \\"properties\\": {
              \\"error\\": {
                \\"type\\": \\"string\\",
                \\"enum\\": [
                  \\"invalid_request\\",
                  \\"invalid_client\\",
                  \\"invalid_grant\\",
                  \\"invalid_scope\\",
                  \\"unauthorized_client\\",
                  \\"unsupported_grant_type\\"
                ]
              }
            }
          }
        }
      }
    },
    \\"500\\": {
      \\"description\\": \\"Something goes wrong\\"
    }
  }
}
*/

const TOauthTokenBody = typed.object({
  grant_type: type.union('authorization_code',),
  // This parameter is for the authorization code received from the authorization server which will be in the query string parameter “code” in this request.
  code: type.string,
  // If the redirect URL was included in the initial authorization request,<br/> it must be included in the token request as well, and must be identical.<br/> Some services support registering multiple redirect URLs, and some require the redirect URL to be specified on each request.<br/>
  redirect_uri: type.string,
  client_id: type.string,
  client_secret: type.string,
})
export type OauthTokenBody = typed.Get<typeof typed.object({
  grant_type: type.union('authorization_code',),
  // This parameter is for the authorization code received from the authorization server which will be in the query string parameter “code” in this request.
  code: type.string,
  // If the redirect URL was included in the initial authorization request,<br/> it must be included in the token request as well, and must be identical.<br/> Some services support registering multiple redirect URLs, and some require the redirect URL to be specified on each request.<br/>
  redirect_uri: type.string,
  client_id: type.string,
  client_secret: type.string,
})>;

const TOauthTokenDone = {{CONTRACT_DONE}};
export type OauthTokenDone = typed.Get<typeof TOauthTokenDone>;

const TOauthTokenFail = {{CONTRACT_FAIL}};
export type OauthTokenFail = typed.Get<typeof TOauthTokenFail>;

/** Exchange the authorization code for an access token */
export const oauthTokenFx = createEffect<OauthToken, OauthTokenDone, OauthTokenFail>({
  async handler(params) {
    const result = await requestFx({
      method: \\"POST\\",
      path: \\"/oauth/token\\",
      body: params,
    });
    return result.body as OauthTokenDone;
  }
});

/*
{
  \\"operationId\\": \\"accessRecoverySendEmail\\",
  \\"tags\\": [
    \\"Access Recovery\\"
  ],
  \\"description\\": \\"Send password recovery confirmation code to email\\",
  \\"requestBody\\": {
    \\"required\\": true,
    \\"content\\": {
      \\"application/json\\": {
        \\"schema\\": {
          \\"type\\": \\"object\\",
          \\"required\\": [
            \\"email\\"
          ],
          \\"properties\\": {
            \\"email\\": {
              \\"type\\": \\"string\\",
              \\"format\\": \\"email\\",
              \\"example\\": \\"user@gmail.com\\"
            }
          }
        }
      }
    }
  },
  \\"responses\\": {
    \\"200\\": {
      \\"description\\": \\"Password changed successfully\\"
    },
    \\"400\\": {
      \\"description\\": \\"Reset code or password is invalid\\",
      \\"content\\": {
        \\"application/json\\": {
          \\"schema\\": {
            \\"type\\": \\"object\\",
            \\"required\\": [
              \\"error\\"
            ],
            \\"properties\\": {
              \\"error\\": {
                \\"type\\": \\"string\\",
                \\"enum\\": [
                  \\"invalid_email\\",
                  \\"invalid_password\\"
                ]
              }
            }
          }
        }
      }
    },
    \\"500\\": {
      \\"description\\": \\"Something goes wrong\\"
    }
  }
}
*/

const TAccessRecoverySendEmailBody = typed.object({
  email: type.string,
})
export type AccessRecoverySendEmailBody = typed.Get<typeof typed.object({
  email: type.string,
})>;

const TAccessRecoverySendEmailDone = {{CONTRACT_DONE}};
export type AccessRecoverySendEmailDone = typed.Get<typeof TAccessRecoverySendEmailDone>;

const TAccessRecoverySendEmailFail = {{CONTRACT_FAIL}};
export type AccessRecoverySendEmailFail = typed.Get<typeof TAccessRecoverySendEmailFail>;

/** Send password recovery confirmation code to email */
export const accessRecoverySendEmailFx = createEffect<AccessRecoverySendEmail, AccessRecoverySendEmailDone, AccessRecoverySendEmailFail>({
  async handler(params) {
    const result = await requestFx({
      method: \\"POST\\",
      path: \\"/access-recovery/send-email\\",
      body: params,
    });
    return result.body as AccessRecoverySendEmailDone;
  }
});

/*
{
  \\"operationId\\": \\"accessRecoverySetPassword\\",
  \\"tags\\": [
    \\"Access Recovery\\"
  ],
  \\"description\\": \\"Set new password by reset code from email\\",
  \\"requestBody\\": {
    \\"required\\": true,
    \\"content\\": {
      \\"application/json\\": {
        \\"schema\\": {
          \\"type\\": \\"object\\",
          \\"required\\": [
            \\"password\\",
            \\"code\\"
          ],
          \\"properties\\": {
            \\"password\\": {
              \\"type\\": \\"string\\",
              \\"example\\": \\"new_password\\"
            },
            \\"code\\": {
              \\"type\\": \\"string\\",
              \\"example\\": \\"beside-kibitz-diverge-install\\"
            }
          }
        }
      }
    }
  },
  \\"responses\\": {
    \\"200\\": {
      \\"description\\": \\"Confirmation code is sent to email\\"
    },
    \\"400\\": {
      \\"description\\": \\"\\",
      \\"content\\": {
        \\"application/json\\": {
          \\"schema\\": {
            \\"type\\": \\"object\\",
            \\"required\\": [
              \\"error\\"
            ],
            \\"properties\\": {
              \\"error\\": {
                \\"type\\": \\"string\\",
                \\"enum\\": [
                  \\"invalid_code\\",
                  \\"password_is_too_short\\",
                  \\"password_is_too_weak\\"
                ]
              }
            }
          }
        }
      }
    },
    \\"500\\": {
      \\"description\\": \\"Something goes wrong\\"
    }
  }
}
*/

const TAccessRecoverySetPasswordBody = typed.object({
  password: type.string,
  code: type.string,
})
export type AccessRecoverySetPasswordBody = typed.Get<typeof typed.object({
  password: type.string,
  code: type.string,
})>;

const TAccessRecoverySetPasswordDone = {{CONTRACT_DONE}};
export type AccessRecoverySetPasswordDone = typed.Get<typeof TAccessRecoverySetPasswordDone>;

const TAccessRecoverySetPasswordFail = {{CONTRACT_FAIL}};
export type AccessRecoverySetPasswordFail = typed.Get<typeof TAccessRecoverySetPasswordFail>;

/** Set new password by reset code from email */
export const accessRecoverySetPasswordFx = createEffect<AccessRecoverySetPassword, AccessRecoverySetPasswordDone, AccessRecoverySetPasswordFail>({
  async handler(params) {
    const result = await requestFx({
      method: \\"POST\\",
      path: \\"/access-recovery/set-password\\",
      body: params,
    });
    return result.body as AccessRecoverySetPasswordDone;
  }
});

/*
{
  \\"operationId\\": \\"viewerGet\\",
  \\"tags\\": [
    \\"External\\"
  ],
  \\"description\\": \\"Get info about viewer by access token\\",
  \\"parameters\\": [
    {
      \\"in\\": \\"header\\",
      \\"name\\": \\"X-Access-Token\\",
      \\"schema\\": {
        \\"type\\": \\"string\\"
      },
      \\"required\\": true
    }
  ],
  \\"responses\\": {
    \\"200\\": {
      \\"description\\": \\"Get profile of the user\\",
      \\"content\\": {
        \\"application/json\\": {
          \\"schema\\": {
            \\"type\\": \\"object\\",
            \\"required\\": [
              \\"firstName\\",
              \\"lastName\\",
              \\"id\\"
            ],
            \\"properties\\": {
              \\"firstName\\": {
                \\"type\\": \\"string\\"
              },
              \\"lastName\\": {
                \\"type\\": \\"string\\"
              },
              \\"id\\": {
                \\"type\\": \\"string\\",
                \\"format\\": \\"uuid\\"
              }
            }
          }
        }
      }
    },
    \\"400\\": {
      \\"description\\": \\"Failed to get profile of the user\\",
      \\"content\\": {
        \\"application/json\\": {
          \\"schema\\": {
            \\"type\\": \\"object\\",
            \\"required\\": [
              \\"error\\"
            ],
            \\"properties\\": {
              \\"error\\": {
                \\"type\\": \\"string\\",
                \\"enum\\": [
                  \\"invalid_token\\",
                  \\"unauthorized\\"
                ]
              }
            }
          }
        }
      }
    },
    \\"500\\": {
      \\"description\\": \\"Something goes wrong\\"
    }
  }
}
*/

const TViewerGetBody = 
export type ViewerGetBody = typed.Get<typeof >;

const TViewerGetDone = {{CONTRACT_DONE}};
export type ViewerGetDone = typed.Get<typeof TViewerGetDone>;

const TViewerGetFail = {{CONTRACT_FAIL}};
export type ViewerGetFail = typed.Get<typeof TViewerGetFail>;

/** Get info about viewer by access token */
export const viewerGetFx = createEffect<ViewerGet, ViewerGetDone, ViewerGetFail>({
  async handler(params) {
    const result = await requestFx({
      method: \\"GET\\",
      path: \\"/viewer\\",
      body: params,
    });
    return result.body as ViewerGetDone;
  }
});

/*
{
  \\"operationId\\": \\"registerRequest\\",
  \\"tags\\": [
    \\"Register\\"
  ],
  \\"description\\": \\"Send registration link to email\\",
  \\"requestBody\\": {
    \\"required\\": true,
    \\"content\\": {
      \\"application/json\\": {
        \\"schema\\": {
          \\"type\\": \\"object\\",
          \\"required\\": [
            \\"email\\"
          ],
          \\"properties\\": {
            \\"email\\": {
              \\"type\\": \\"string\\"
            }
          }
        }
      }
    }
  },
  \\"responses\\": {
    \\"201\\": {
      \\"description\\": \\"Registration link sent to email, now user can find out when the link expires\\",
      \\"content\\": {
        \\"application/json\\": {
          \\"schema\\": {
            \\"type\\": \\"object\\",
            \\"required\\": [
              \\"expiresAt\\"
            ],
            \\"properties\\": {
              \\"expiresAt\\": {
                \\"type\\": \\"integer\\",
                \\"format\\": \\"int32\\",
                \\"description\\": \\"UTC Unix TimeStamp when the link expires\\"
              }
            }
          }
        }
      }
    },
    \\"400\\": {
      \\"description\\": \\"Please, login or recover password\\",
      \\"content\\": {
        \\"application/json\\": {
          \\"schema\\": {
            \\"type\\": \\"object\\",
            \\"required\\": [
              \\"error\\"
            ],
            \\"properties\\": {
              \\"error\\": {
                \\"type\\": \\"string\\",
                \\"enum\\": [
                  \\"email_already_registered\\",
                  \\"invalid_form\\",
                  \\"invalid_payload\\"
                ]
              }
            }
          }
        }
      }
    },
    \\"500\\": {
      \\"description\\": \\"Something goes wrong\\"
    }
  }
}
*/

const TRegisterRequestBody = typed.object({
  email: type.string,
})
export type RegisterRequestBody = typed.Get<typeof typed.object({
  email: type.string,
})>;

const TRegisterRequestDone = {{CONTRACT_DONE}};
export type RegisterRequestDone = typed.Get<typeof TRegisterRequestDone>;

const TRegisterRequestFail = {{CONTRACT_FAIL}};
export type RegisterRequestFail = typed.Get<typeof TRegisterRequestFail>;

/** Send registration link to email */
export const registerRequestFx = createEffect<RegisterRequest, RegisterRequestDone, RegisterRequestFail>({
  async handler(params) {
    const result = await requestFx({
      method: \\"POST\\",
      path: \\"/register/request\\",
      body: params,
    });
    return result.body as RegisterRequestDone;
  }
});

/*
{
  \\"operationId\\": \\"registerConfirmation\\",
  \\"tags\\": [
    \\"Register\\"
  ],
  \\"description\\": \\"Confirm email, fill profile required fields and create user\\",
  \\"requestBody\\": {
    \\"required\\": true,
    \\"content\\": {
      \\"application/json\\": {
        \\"schema\\": {
          \\"type\\": \\"object\\",
          \\"required\\": [
            \\"confirmationCode\\",
            \\"firstName\\",
            \\"lastName\\",
            \\"password\\"
          ],
          \\"properties\\": {
            \\"confirmationCode\\": {
              \\"type\\": \\"string\\"
            },
            \\"firstName\\": {
              \\"type\\": \\"string\\"
            },
            \\"lastName\\": {
              \\"type\\": \\"string\\"
            },
            \\"password\\": {
              \\"type\\": \\"string\\"
            }
          }
        }
      }
    }
  },
  \\"responses\\": {
    \\"201\\": {
      \\"description\\": \\"Okay, user created\\"
    },
    \\"400\\": {
      \\"description\\": \\"Please, login or recover password\\",
      \\"content\\": {
        \\"application/json\\": {
          \\"schema\\": {
            \\"type\\": \\"object\\",
            \\"required\\": [
              \\"error\\"
            ],
            \\"properties\\": {
              \\"error\\": {
                \\"type\\": \\"string\\",
                \\"enum\\": [
                  \\"code_invalid_or_expired\\",
                  \\"email_already_activated\\",
                  \\"invalid_form\\",
                  \\"invalid_payload\\"
                ]
              }
            }
          }
        }
      }
    },
    \\"500\\": {
      \\"description\\": \\"Something goes wrong\\"
    }
  }
}
*/

const TRegisterConfirmationBody = typed.object({
  confirmationCode: type.string,
  firstName: type.string,
  lastName: type.string,
  password: type.string,
})
export type RegisterConfirmationBody = typed.Get<typeof typed.object({
  confirmationCode: type.string,
  firstName: type.string,
  lastName: type.string,
  password: type.string,
})>;

const TRegisterConfirmationDone = {{CONTRACT_DONE}};
export type RegisterConfirmationDone = typed.Get<typeof TRegisterConfirmationDone>;

const TRegisterConfirmationFail = {{CONTRACT_FAIL}};
export type RegisterConfirmationFail = typed.Get<typeof TRegisterConfirmationFail>;

/** Confirm email, fill profile required fields and create user */
export const registerConfirmationFx = createEffect<RegisterConfirmation, RegisterConfirmationDone, RegisterConfirmationFail>({
  async handler(params) {
    const result = await requestFx({
      method: \\"POST\\",
      path: \\"/register/confirmation\\",
      body: params,
    });
    return result.body as RegisterConfirmationDone;
  }
});

/*
{
  \\"operationId\\": \\"sessionCreate\\",
  \\"tags\\": [
    \\"Session\\"
  ],
  \\"description\\": \\"Login and create new session token\\",
  \\"requestBody\\": {
    \\"required\\": true,
    \\"content\\": {
      \\"application/json\\": {
        \\"schema\\": {
          \\"type\\": \\"object\\",
          \\"required\\": [
            \\"email\\",
            \\"password\\"
          ],
          \\"properties\\": {
            \\"email\\": {
              \\"type\\": \\"string\\",
              \\"format\\": \\"email\\"
            },
            \\"password\\": {
              \\"type\\": \\"string\\"
            }
          }
        }
      }
    }
  },
  \\"responses\\": {
    \\"201\\": {
      \\"description\\": \\"Session created, token wrote to cookies\\",
      \\"content\\": {
        \\"application/json\\": {
          \\"schema\\": {
            \\"type\\": \\"object\\",
            \\"required\\": [
              \\"firstName\\",
              \\"lastName\\"
            ],
            \\"properties\\": {
              \\"firstName\\": {
                \\"type\\": \\"string\\"
              },
              \\"lastName\\": {
                \\"type\\": \\"string\\"
              }
            }
          }
        }
      }
    },
    \\"400\\": {
      \\"description\\": \\"Login failed\\",
      \\"content\\": {
        \\"application/json\\": {
          \\"schema\\": {
            \\"type\\": \\"object\\",
            \\"required\\": [
              \\"error\\"
            ],
            \\"properties\\": {
              \\"error\\": {
                \\"type\\": \\"string\\",
                \\"enum\\": [
                  \\"invalid_credentials\\",
                  \\"invalid_form\\",
                  \\"invalid_payload\\"
                ]
              }
            }
          }
        }
      }
    },
    \\"500\\": {
      \\"description\\": \\"Something went wrong\\"
    }
  }
}
*/

const TSessionCreateBody = typed.object({
  email: type.string,
  password: type.string,
})
export type SessionCreateBody = typed.Get<typeof typed.object({
  email: type.string,
  password: type.string,
})>;

const TSessionCreateDone = {{CONTRACT_DONE}};
export type SessionCreateDone = typed.Get<typeof TSessionCreateDone>;

const TSessionCreateFail = {{CONTRACT_FAIL}};
export type SessionCreateFail = typed.Get<typeof TSessionCreateFail>;

/** Login and create new session token */
export const sessionCreateFx = createEffect<SessionCreate, SessionCreateDone, SessionCreateFail>({
  async handler(params) {
    const result = await requestFx({
      method: \\"POST\\",
      path: \\"/session/create\\",
      body: params,
    });
    return result.body as SessionCreateDone;
  }
});

/*
{
  \\"operationId\\": \\"sessionGet\\",
  \\"tags\\": [
    \\"Session\\"
  ],
  \\"description\\": \\"Read session token and show current session. Authenticated checked by session-token cookie\\",
  \\"responses\\": {
    \\"200\\": {
      \\"description\\": \\"Session exists\\",
      \\"content\\": {
        \\"application/json\\": {
          \\"schema\\": {
            \\"type\\": \\"object\\",
            \\"required\\": [
              \\"user\\"
            ],
            \\"properties\\": {
              \\"user\\": {
                \\"description\\": \\"Current user in a session\\",
                \\"type\\": \\"object\\",
                \\"required\\": [
                  \\"firstName\\",
                  \\"lastName\\"
                ],
                \\"properties\\": {
                  \\"firstName\\": {
                    \\"type\\": \\"string\\"
                  },
                  \\"lastName\\": {
                    \\"type\\": \\"string\\"
                  }
                }
              }
            }
          }
        }
      }
    },
    \\"401\\": {
      \\"description\\": \\"User not authorized\\"
    },
    \\"500\\": {
      \\"description\\": \\"Something went wrong\\"
    }
  }
}
*/

const TSessionGetBody = 
export type SessionGetBody = typed.Get<typeof >;

const TSessionGetDone = {{CONTRACT_DONE}};
export type SessionGetDone = typed.Get<typeof TSessionGetDone>;

const TSessionGetFail = {{CONTRACT_FAIL}};
export type SessionGetFail = typed.Get<typeof TSessionGetFail>;

/** Read session token and show current session. Authenticated checked by session-token cookie */
export const sessionGetFx = createEffect<SessionGet, SessionGetDone, SessionGetFail>({
  async handler(params) {
    const result = await requestFx({
      method: \\"POST\\",
      path: \\"/session/get\\",
      body: params,
    });
    return result.body as SessionGetDone;
  }
});

"
`;

exports[`CLI Should generate accesso api: files 1`] = `
"accesso-app-public-api.ts
"
`;
