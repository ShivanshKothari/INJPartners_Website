"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import axios from "axios";


export default function BlogPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [blogPosts, setBlogPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
    const fetchStudy = async () => {
        try {
            const response = await axios<{ services: any[] }>(
                `/api/blog`
            );
            setBlogPosts(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch services. Please try again later.");
            setLoading(false);
        }
    };
    fetchStudy();
}, []);

if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
}

if (error) {
    return (
        <div className="container mx-auto px-4 py-8 text-red-500">
            {error}
        </div>
    );
}

    const categories = [
        "All",
        "Market Trends",
        "Research Methodologies",
        "Industry Insights",
    ];

    const filteredPosts = blogPosts.filter(
        (post) =>
            (selectedCategory === "All" ||
                post.category === selectedCategory) &&
            (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.summary.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold text-primary mb-2">
                    Insightful Research Blog
                </h1>
                <p className="text-xl text-muted-foreground">
                    Stay Updated with the Latest Market Research Insights
                </p>
            </header>

            <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search articles..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={
                                selectedCategory === category
                                    ? "default"
                                    : "outline"
                            }
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                    <Card key={post.id}>
                        <CardHeader className="p-0">
                            <Image
                                src={post.image}
                                alt={post.title}
                                width={300}
                                height={200}
                                className="w-full h-48 object-cover"
                            />
                        </CardHeader>
                        <CardContent className="p-4">
                            <Badge className="mb-2">{post.category}</Badge>
                            <CardTitle className="text-xl mb-2">
                                {post.title}
                            </CardTitle>
                            <CardDescription>{post.summary}</CardDescription>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center p-4">
                            <div className="text-sm text-muted-foreground">
                                By {post.author} | {post.date}
                            </div>
                            <Button asChild>
                                <Link href={`/blog/${post.id}`}>Read More</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
