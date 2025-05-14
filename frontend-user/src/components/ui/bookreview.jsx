'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Star, Check, MessageCircle } from 'lucide-react';

function BookReview() {
  return (
    <div className="border rounded-md p-4 space-y-4 bg-white shadow-sm">
      <Tabs defaultValue="review">
        <TabsList className="flex space-x-2 border-b ">
          <TabsTrigger value="review" className="cursor-pointer">Đánh giá</TabsTrigger>
          <TabsTrigger value="question" className="cursor-pointer">Câu hỏi & Trả lời</TabsTrigger>
        </TabsList>

        {/* Tab Đánh Giá */}
        <TabsContent value="review" className="mt-4">
          <p className="font-bold text-xl">Đánh giá</p>
          <div className="flex gap-1 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="stroke-current" fill="none" />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">Dựa trên 0 đánh giá</p>



          <hr className="border-t my-4" />

          <button className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50">
            <Check className="w-5 h-5 text-green-500" />
            <span>Viết đánh giá</span>
          </button>
        </TabsContent>

        {/* Tab Câu Hỏi & Trả Lời */}
        <TabsContent value="question" className="mt-4">
          <p className="font-bold text-xl">Câu hỏi & Trả lời</p>
          <p className="text-gray-500">Hiện chưa có câu hỏi nào.</p>

          <button className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 mt-4">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <span>Đặt câu hỏi</span>
          </button>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default BookReview;