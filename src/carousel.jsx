import { Carousel, Typography, Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function CarouselWithContent() {
  return (
    <Carousel className="" autoplay={true} loop={true}>
      <div className="relative h-full w-full">
        <div className="absolute inset-0 grid h-full w-full place-items-center">
          <div className="w-3/4 text-center md:w-2/4">
            <Typography
              variant="h1"
              color="black"
              className="mb-4 text-3xl md:text-4xl lg:text-5xl"
            >
              Пошук рецептів
            </Typography>
            <Typography
              variant="lead"
              color="black"
              className="mb-12 opacity-80"
            >
              Знайдіть рецепти за наявними інгредієнтами! В нашому додатку ви
              можете шукати рецепти, виходячи зі списку інгредієнтів, які у вас
              є в наявності. Швидко та легко знайдіть ідеї для приготування
              смачних страв, не виходячи з дому.
            </Typography>
            <div className="flex justify-center gap-2">
              <Button size="lg" color="amber">
                <Link to="recipe">Пошук</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative h-full w-full">
        <div className="absolute inset-0 grid h-full w-full place-items-center">
          <div className="w-3/4 text-center md:w-2/4">
            <Typography
              variant="h1"
              color="black"
              className="mb-4 text-3xl md:text-4xl lg:text-5xl"
            >
              Список покупок
            </Typography>
            <Typography
              variant="lead"
              color="black"
              className="mb-12 opacity-80"
            >
              Немає всіх необхідних інгредієнтів для рецепту? Це не проблема!
              Наш додаток дозволяє легко додати відсутні компоненти до списку
              покупок одним кліком. Так ви зможете зручно планувати свої покупки
              та готувати улюблені страви.
            </Typography>
            <div className="flex justify-center gap-2">
              <Button size="lg" color="amber">
                <Link to="shoppingList">Список</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative h-full w-full">
        <div className="absolute inset-0 grid h-full w-full place-items-center">
          <div className="w-3/4 text-center md:w-2/4">
            <Typography
              variant="h1"
              color="black"
              className="mb-4 text-3xl md:text-4xl lg:text-5xl"
            >
              Авторські рецепти
            </Typography>
            <Typography
              variant="lead"
              color="black"
              className="mb-12 opacity-80"
            >
              Ваша авторська кулінарна майстерність також цінна! Ви можете
              створювати та додавати свої унікальні рецепти до нашого додатку.
              Поділіться смаколиками з іншими користувачами та знайомтесь з
              безліччю смачних ідей від інших кулінарів.
            </Typography>
            <div className="flex justify-center gap-2">
              <Button size="lg" color="amber">
                <Link to="addRecipe">Додати</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Carousel>
  );
}
