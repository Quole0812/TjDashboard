import { useParams } from "react-router-dom";

export default function ClassPage() {
    const { id } = useParams();

    return (
        <div>
            <h2>class page for {id}</h2>
        </div>
    );
}