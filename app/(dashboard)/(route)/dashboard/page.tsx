import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

const DeshboardPage=()=>{
    return (
        // protacted  page\
        <div>

            <p>dashboard page</p>
            <UserButton/>
        </div>
    )
}

export default DeshboardPage;