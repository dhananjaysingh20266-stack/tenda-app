import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Key, Download } from 'lucide-react'
import type { KeyGenerationForm as KeyGenerationFormType } from '@/types'

const keyGenerationSchema = z.object({
  gameId: z.number().min(1, 'Please select a game'),
  maxDevices: z.number().min(1, 'Must be at least 1').max(10, 'Maximum 10 devices'),
  durationHours: z.number().min(1, 'Please select duration'),
  bulkQuantity: z.number().min(1, 'Must be at least 1').max(100, 'Maximum 100 keys'),
  customKey: z.string().optional(),
  description: z.string().optional(),
})

const KeyGenerationPage = () => {
  const [generatedKeys, setGeneratedKeys] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<KeyGenerationFormType>({
    resolver: zodResolver(keyGenerationSchema),
    defaultValues: {
      gameId: 1,
      maxDevices: 1,
      durationHours: 24,
      bulkQuantity: 1,
    },
  })

  const watchedValues = watch()

  const games = [
    { id: 1, name: 'PUBG Mobile', slug: 'pubg-mobile' },
    { id: 2, name: 'Free Fire', slug: 'free-fire' },
    { id: 3, name: 'Call of Duty Mobile', slug: 'cod-mobile' },
  ]

  const durations = [
    { hours: 1, label: '1 Hour' },
    { hours: 3, label: '3 Hours' },
    { hours: 5, label: '5 Hours' },
    { hours: 12, label: '12 Hours' },
    { hours: 24, label: '24 Hours' },
    { hours: 168, label: '1 Week' },
  ]

  const calculateCost = () => {
    const basePrices: { [key: number]: { [key: number]: number } } = {
      1: { 1: 10, 3: 25, 5: 50, 12: 100, 24: 180, 168: 1000 }, // PUBG Mobile
      2: { 1: 8, 3: 20, 5: 40, 12: 80, 24: 150, 168: 800 },   // Free Fire
      3: { 1: 12, 3: 30, 5: 60, 12: 120, 24: 200, 168: 1200 }, // COD Mobile
    }

    const pricePerDevice = basePrices[watchedValues.gameId]?.[watchedValues.durationHours] || 0
    const totalCost = pricePerDevice * watchedValues.maxDevices * watchedValues.bulkQuantity
    return { pricePerDevice, totalCost }
  }

  const onSubmit = async (data: KeyGenerationFormType) => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      const mockKeys = Array.from({ length: data.bulkQuantity }, (_, i) => ({
        id: `key_${Date.now()}_${i}`,
        key: `GAME_${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
        maxDevices: data.maxDevices,
        expiresAt: new Date(Date.now() + data.durationHours * 60 * 60 * 1000).toISOString(),
        cost: calculateCost().pricePerDevice * data.maxDevices,
      }))
      setGeneratedKeys(mockKeys)
      setIsGenerating(false)
    }, 2000)
  }

  const { pricePerDevice, totalCost } = calculateCost()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Key Generation</h1>
        <p className="mt-1 text-sm text-gray-600">
          Generate gaming access keys with customizable settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                Configuration
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Game
                  </label>
                  <select
                    {...register('gameId', { valueAsNumber: true })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    {games.map((game) => (
                      <option key={game.id} value={game.id}>
                        {game.name}
                      </option>
                    ))}
                  </select>
                  {errors.gameId && (
                    <p className="mt-1 text-sm text-red-600">{errors.gameId.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Max Devices per Key
                    </label>
                    <input
                      {...register('maxDevices', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      max="10"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.maxDevices && (
                      <p className="mt-1 text-sm text-red-600">{errors.maxDevices.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Duration
                    </label>
                    <select
                      {...register('durationHours', { valueAsNumber: true })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      {durations.map((duration) => (
                        <option key={duration.hours} value={duration.hours}>
                          {duration.label}
                        </option>
                      ))}
                    </select>
                    {errors.durationHours && (
                      <p className="mt-1 text-sm text-red-600">{errors.durationHours.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bulk Quantity
                  </label>
                  <input
                    {...register('bulkQuantity', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    max="100"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.bulkQuantity && (
                    <p className="mt-1 text-sm text-red-600">{errors.bulkQuantity.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Custom Key Prefix (Optional)
                  </label>
                  <input
                    {...register('customKey')}
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="MY_CUSTOM_KEY"
                  />
                  {errors.customKey && (
                    <p className="mt-1 text-sm text-red-600">{errors.customKey.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description (Optional)
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Key description..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Key className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Keys'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Cost Preview */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Cost Preview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Price per device:</span>
                  <span className="text-sm font-medium">₹{pricePerDevice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Devices per key:</span>
                  <span className="text-sm font-medium">{watchedValues.maxDevices}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Quantity:</span>
                  <span className="text-sm font-medium">{watchedValues.bulkQuantity}</span>
                </div>
                <hr />
                <div className="flex justify-between">
                  <span className="text-base font-medium">Total Cost:</span>
                  <span className="text-base font-bold text-primary-600">₹{totalCost}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Generated Keys */}
          {generatedKeys.length > 0 && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Generated Keys
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {generatedKeys.map((key) => (
                    <div key={key.id} className="border border-gray-200 rounded p-3">
                      <div className="font-mono text-sm bg-gray-50 p-2 rounded">
                        {key.key}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Expires: {new Date(key.expiresAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full bg-secondary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary-700 flex items-center justify-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export Keys
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default KeyGenerationPage