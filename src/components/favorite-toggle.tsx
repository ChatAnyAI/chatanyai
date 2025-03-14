import { useFavorite } from "@/hooks/use-favorite";
import { Button } from "./ui/button";
import { Star } from "lucide-react";

interface FavoriteToggleProps {
    initialState: boolean;
    appId: string;
}

export function FavoriteToggle({ initialState, appId }: FavoriteToggleProps) {
    const { handleFavoriteClick, isFavorite } = useFavorite(initialState, appId);

    return (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
            e.stopPropagation()
            handleFavoriteClick()
        }} style={{ cursor: 'pointer' }}>
            <Star className={`h-4 w-4 ${isFavorite ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} />
        </Button>
    );
}