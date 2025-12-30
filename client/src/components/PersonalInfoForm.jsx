import { BriefcaseBusiness, Globe, Linkedin, Mail, MapPin, Phone, User } from 'lucide-react'
import React from 'react'

const PersonalInfoForm = ({data,onChange,removeBackground,setRemoveBackground}) => {

const handleChange = (field,value)=>{
    onChange({...data,[field]:value})
}



const fields = [
    {key:'full_name',label:'Full Name',icon:User,type:'text',required:true},
    {key:'email',label:'Email Address',icon:Mail,type:'email',required:true},
    {key:'phone',label:'Phone Number',icon:Phone,type:'tel',required:true},
    {key:'location',label:'Location',icon:MapPin,type:'text',required:true},
    {key:'profession',label:'Profession',icon:BriefcaseBusiness,type:'text',required:true},
    {key:'linkedin',label:'LinkedIn profile',icon:Linkedin,type:'url',required:true},
    {key:'website',label:'Personal Website',icon:Globe,type:'url',required:true},
]

  return (
    <div>
        <h3 className='text-lg font-semibold text-gray-900'>Personal Information</h3>
        <p className='text-sm text-gray-600'>Get Started with the personal information</p>
        <div className='flex xitems-center gap-2'>
            <label>
                {data.image ? (
                    <img src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)} alt="user-image"
                    className='w-16 h-16 rounded-full object-cover mt-5 ring ring-slate-300 hover:opacity-80' />
                ):(
                    <div className='inline-flex items-center gap-2 mt-5 text-slate-600 hover:text-slate-700 cursor-pointer'>
                        <User className='size-10 p-2.5 border rounded-full'/>
                        Upload user image
                        <p className='text-sm text-red-500'>This upload photo was not working tempervarely, if you need add photo and download it without save</p>
                    </div>
                )}
                <input type="file" accept='image/jpeg,image/png' className='hidden' onChange={(e)=>handleChange('image',e.target.files[0])} />
            </label>
            <div className='flex items-center gap-2'>
  {/* Image display - separate from label */}
  {/* <div className="relative group">
    {data.image ? (
     <img 
    src={`${typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)}?t=${Date.now()}`} 
    alt="user-image"
    className='w-16 h-16 rounded-full object-cover mt-5 ring ring-slate-300 hover:opacity-80'
    onError={(e) => {
      console.log('Image failed to load:', data.image);
      e.target.src = '/default-avatar.png'; // Fallback image
    }}
  />
    ) : (
      <div className='w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mt-5'>
        <User className='size-8 text-gray-400'/>
      </div>
    )}
  </div> */}
  
  {/* Upload button with proper label */}
  <div className="mt-5">
    <label htmlFor="profile-image-upload" className="cursor-pointer">
      <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm'>
        {data.image ? 'Change Photo' : 'Upload Photo'}
      </div>
    </label>
    <input 
      id="profile-image-upload"
      type="file" 
      accept='image/jpeg,image/png' 
      className='hidden' 
      onChange={(e) => {
        if (e.target.files && e.target.files[0]) {
          handleChange('image', e.target.files[0]);
        }
      }} 
    />
  </div>
  
  {/* Remove background checkbox - only show when image is a File object */}
  {/* {typeof data.image === 'object' && data.image instanceof File && (
    <div className='flex flex-col gap-1 pl-4 text-sm mt-5'>
      <p className="text-gray-700">Remove Background</p>
      <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
        <input 
          type="checkbox" 
          className='sr-only peer' 
          onChange={() => setRemoveBackground(prev => !prev)} 
          checked={removeBackground}
        />
        <div className='w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200'>
        </div>
        <span className='dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4'></span>
      </label>
    </div>
  )} */}
</div>
            {typeof data.image === 'object' && (
                <div className='flex flex-col gap-1 pl-4 text-sm mt-5'>
                    <p>Remove Background</p>
                    <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
                       <input type="checkbox" className='sr-only peer' 
                       onChange={()=>setRemoveBackground(prev => !prev)} checked={removeBackground}/>
                       <div className='w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200'>
                       </div>
                       <span className='dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200
                       ease-in-out peer-checked:translate-x-4'></span>
                    </label>
                </div>
            )}
        </div>

     {fields.map((field)=>{
        const Icon = field.icon;
        return (
            <div key={field.key} className='space-y-1 mt-5'>
              <label className='flex items-center gap-2 text-sm font-medium text-gray-600'>
                <Icon className='size-4'/>
                {field.label}
                {field.required && <span className='text-red-500'>*</span>}
              </label>
              <input type={field.type} value={data[field.key] || ""}
               onChange={(e)=>handleChange(field.key,e.target.value)} 
               className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500
               focus:border-blue-blue-500 outline-none transition-colors text-sm' placeholder={`Enter your ${field.label.toLowerCase()}`} required={field.required}/>
            </div>
        )
     })}

    </div>
  )
}

export default PersonalInfoForm