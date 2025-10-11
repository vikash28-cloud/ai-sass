import { LucideIcon } from "lucide-react"

interface HeadingProps {
    title: string,
    description: string,
    icon: LucideIcon,
    iconColor?: string,
    bgColor?: string
}

export const Heading = ({
    title, description, icon: Icon, iconColor, bgColor
}:HeadingProps) => {
    return (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 ">
      {/* Left side: icon + title */}
      <div className="flex items-center gap-3">
        <div
          className={`p-3 rounded-xl ${bgColor} flex items-center justify-center`}
        >
          <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${iconColor}`} />
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-gray-500">{description}</p>
        </div>
      </div>
    </div>
    )
}