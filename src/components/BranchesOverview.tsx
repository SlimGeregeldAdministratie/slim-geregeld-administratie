import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Palette, Users, Laptop, ShoppingBag } from 'lucide-react';

const BranchesOverview = () => {
  const branches = [
    {
      title: 'Bouw & installatie',
      description: 'Gespecialiseerde administratie voor bouwbedrijven, aannemers en installateurs. Van projectadministratie tot urenstaten.',
      icon: Building2,
      link: '/bouw',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Creatieve beroepen',
      description: 'Voor freelancers, designers, fotografen en andere creatievelingen. Focus op wat je het beste doet.',
      icon: Palette,
      link: '/creatief',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Persoonlijke dienstverlening',
      description: 'Coaches, therapeuten, trainers en consultants. Meer tijd voor je klanten, wij regelen de administratie.',
      icon: Users,
      link: '/persoonlijk',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Techniek & ICT',
      description: 'IT-specialisten, developers en tech-consultants. Jouw code is perfect, wij maken je administratie even goed.',
      icon: Laptop,
      link: '/tech',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'E-commerce & detailhandel',
      description: 'Webshops en retailers. Van voorraad tot verzending, wij houden jouw administratie actueel.',
      icon: ShoppingBag,
      link: '/ecommerce',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Branches
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Maatwerk administratie voor jouw branche. Wij begrijpen de specifieke uitdagingen van jouw sector en leveren gerichte oplossingen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {branches.map((branch, index) => {
            const Icon = branch.icon;
            return (
              <Link
                key={index}
                to={branch.link}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
                <div className={`${branch.bgColor} p-8 border-b border-gray-100`}>
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${branch.color} shadow-lg mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {branch.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {branch.description}
                  </p>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <span className={`font-semibold ${branch.textColor}`}>
                    Bekijk meer
                  </span>
                  <svg
                    className={`h-5 w-5 ${branch.textColor} group-hover:translate-x-2 transition-transform`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Jouw branche staat er niet bij?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Geen probleem. Wij hebben ervaring met diverse branches en passen onze dienstverlening aan jouw specifieke behoeften aan.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Neem contact op
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchesOverview;
