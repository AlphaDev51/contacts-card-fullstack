from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    name: str 
    # class Config:
    #     orm_mode = True
    model_config = ConfigDict(from_attributes=True)


class ContactBase(BaseModel):
    name: str
    email: str
    phone: str
    tag: str
    is_favorite: bool = False


class ContactOut(ContactBase):
    id: int
    owner_id: int
    model_config = ConfigDict(from_attributes=True)
