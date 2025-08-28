import { ref } from "vue";
import { connect } from "../stores/form";


const current_url = new URL(window.location.toString());

export const twitch_oauth_token = ref<string | null>(null);
export const twitch_oauth_scope = ref<string[] | null>(null);
export const twitch_oauth_token_type = ref<string | null>(null);

if (current_url.searchParams.has("twitch_oauth") && current_url.hash) {
    const params = new URLSearchParams(current_url.hash.slice(1));
    const message = {
        twitch_access_token: params.get("access_token"),
        scope: params.get("scope")?.split(" ") ?? null,
        token_type: params.get("token_type")
    };

    if (window.opener) {
        window.opener.postMessage(message, window.location.origin);
        window.close();
    }
}

export const twitch_client_id = import.meta.env.VITE_TWITCH_CLIENT_ID!;


const twitchOauthBaseUrl = new URL("https://id.twitch.tv/oauth2/authorize");

// Set the required parameters for the Implicit Grant Flow
twitchOauthBaseUrl.searchParams.set("client_id", twitch_client_id);
twitchOauthBaseUrl.searchParams.set("redirect_uri", "http://localhost:5173?twitch_oauth");
twitchOauthBaseUrl.searchParams.set("response_type", "token");

twitchOauthBaseUrl.searchParams.set("scope", "user:read:chat");
export const twitchChatRead = twitchOauthBaseUrl.toString();
twitchOauthBaseUrl.searchParams.set("scope", "user:read:chat user:write:chat");
export const twitchChatReadEdit = twitchOauthBaseUrl.toString();

export function openTwitchOauth(url: string) {
    const authWindow = window.open(url, '_blank');
    if (authWindow == null) return;
    const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        if (event.data.twitch_access_token) {
            twitch_oauth_token.value = event.data.twitch_access_token;
            twitch_oauth_scope.value = event.data.scope;
            twitch_oauth_token_type.value = event.data.token_type;
            window.removeEventListener('message', messageListener);
            authWindow.close();
            connect();
        }
    };

    window.addEventListener('message', messageListener);
}
