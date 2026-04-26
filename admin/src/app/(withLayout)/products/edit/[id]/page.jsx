import EditProductScreen from "@/screens/products/edit";

export default function EditProductPage({ params }) {
  return <EditProductScreen productId={params.id} />;
}