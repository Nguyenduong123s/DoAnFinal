import { formatCurrency } from "@/lib/utils";
import { DishResType } from "@/schemaValidations/dish.schema";
import Image from "next/image";

export default async function DishDetail({
  dish,
}: {
  dish: DishResType["data"] | undefined;
}) {
  if (!dish)
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Món ăn không tồn tại
        </h1>
      </div>
    );
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
        {dish.name}
      </h1>

      <div className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
        Giá: {formatCurrency(dish.price)}
      </div>

      <div className="w-full max-w-2xl">
        <Image
          src={dish.image}
          width={700}
          height={700}
          quality={100}
          alt={dish.name}
          className="object-cover w-full h-auto rounded-lg shadow-lg"
          title={dish.name}
        />
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {dish.description}
        </p>
      </div>
    </div>
  );
}
