import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

export default function Chat({array})
{
    return (
        <div>
            <ChatList array={array}/>
            <ChatWindow array={array}/>
        </div>
    )
}