interface PageHeaderProps {
  title: string;
  desc: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, desc, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-gray-900">{title}</h1>
        <p className="text-gray-500 text-sm mt-1">{desc}</p>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
