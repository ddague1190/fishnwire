import React from 'react'
import { CheckIcon } from '@heroicons/react/solid'
import { Link } from "react-router-dom"


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function CheckoutSteps({step1=false, step2=false, step3=false, step4=false }) {

    const steps = [
        { name: 'Cart', to: '/cart', status: step1 },
        { name: 'Shipping', to: '/shipping', status: step2 },
        { name: 'Checkout', to: '/placeorder', status: step3 },
      ]

  return (
    <nav aria-label="Progress mx-auto">
      <ol role="list" className="flex items-center justify-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={classNames(stepIdx !== steps.length - 1 ? 'pr-12 xs:pr-32' : '', 'relative')}>
            {step.status === 'complete' ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-blue-600" />
                </div>
                <div
                  className="relative w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full"
                >
                  <CheckIcon className="w-10 h-5 text-white" aria-hidden="true" />
                  <Link to={step.to} className="text-blue-600 translate-y-6">{step.name}</Link>
                </div>
              </>
            ) : step.status === 'current' ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div
                  className="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-blue-600 rounded-full"
                  aria-current="step"
                >
                  <span className="h-2.5 w-2.5 bg-blue-600 rounded-full" aria-hidden="true" />
                  <span className="text-blue-600 translate-y-6">{step.name}</span>
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div
                  className="group relative w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full"
                >
                  <span
                    className="h-2.5 w-2.5 bg-transparent rounded-full "
                    aria-hidden="true"
                  />
                  <div className="text-gray-500 translate-y-6 w-max">{step.name}</div>
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

