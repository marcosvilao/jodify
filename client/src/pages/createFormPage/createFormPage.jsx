import React, { useState, useEffect } from 'react'
import styles from './createFormPage.module.css'
import axios from 'axios'
import dayjs from 'dayjs'
import Alert from '../../components2/alert/alert'
import EventCard from '../../components2/eventCard/eventCard'
import Loader from '../../components2/loader/loader'
import SelectMaterial from '../../components2/selectMaterial/selectMaterial'
import Button from '../../components2/ButtonCreateEvents/button'
import InputFile from '../../components2/inputFile/inputFile'
import DatePicker from '../../components2/datePicker/datePicker'
import InputOutlined from '../../components2/inputMaterial/inputMaterial'

function CreateFormPage() {
  const axiosUrl = process.env.REACT_APP_AXIOS_URL
  const cloudinayUrl = process.env.REACT_APP_CLOUDINARY_URL + '/image/upload'
  const [loader, setLoader] = useState(false)
  const [loaderPupeteer, setLoaderPupeteer] = useState(false)
  const [datePupeteer, setDatePupeteer] = useState(false)
  const [submitLoader, setSubmitLoader] = useState(false)
  const [errorEnlace, setErrorEnlace] = useState('')
  const [errorDireccion, setErrorDireccion] = useState('')
  const [errorLineUp, setErrorLineUp] = useState('')
  const [errorPlace, setErrorPlace] = useState('')
  const [errorFecha, setErrorFecha] = useState('')
  const [errorGeneros, setErrorGeneros] = useState('')
  const [errorFile, setErrorFile] = useState('')
  const [cities, setCities] = useState(false)
  const [filterCities, setFilterCities] = useState(false)
  const [dataTypes, setDataTypes] = useState(false)
  const [types, setTypes] = useState(false)
  const [stringDjs, setStringDjs] = useState([])
  const [dataDjs, setDataDjs] = useState(false)
  const [djs, setDjs] = useState(false)
  const [promoters, setPromoters] = useState(false)
  const [dataPromoters, setDataPromoters] = useState(false)
  const [dataCardType, setDataCardType] = useState([])
  const [valueChipsCiudad, setValueChipsCiudad] = useState([])
  const [valueChipsProductora, setValueChipsProductora] = useState([])
  const [valueChipsDjs, setValueChipsDjs] = useState([])
  const [valueChipsTypes, setValueChipsTypes] = useState([])

  const [dataPost, setDataPost] = useState({
    name: '',
    event_type: [],
    date_from: '',
    venue: '',
    ticket_link: '',
    image_url: '',
    event_djs: [],
    event_city: '',
    event_promoter: [],
  })

  useEffect(() => {
    if (!cities) {
      axios
        .get(axiosUrl + '/jodify/city')
        .then((res) => {
          const arrayCities = []
          res.data.map((citie) => {
            arrayCities.push({ value: citie.city_name })
          })
          setCities(arrayCities)
          setFilterCities(res.data)
        })
        .catch(() => {
          Alert('Error!', 'Error al cargar las ciudades', 'error')
        })
    }

    if (!types) {
      axios
        .get(axiosUrl + '/jodify/types')
        .then((res) => {
          const arrayTypes = []
          res.data.map((type) => {
            arrayTypes.push({ value: type.name })
          })
          setTypes(arrayTypes)
          setDataTypes(res.data)
        })
        .catch(() => {
          Alert('Error!', 'Error al cargar los generos', 'error')
        })
    }

    if (!djs) {
      axios
        .get(axiosUrl + '/jodify/djs')
        .then((res) => {
          const arrayDjs = []
          res.data.map((djs) => {
            arrayDjs.push({ value: djs.name })
          })
          setDjs(arrayDjs)
          setDataDjs(res.data)
        })
        .catch(() => {
          Alert('Error!', 'Error al cargar los djs', 'error')
        })
    }

    if (!promoters) {
      axios
        .get(axiosUrl + '/promoters')
        .then((res) => {
          const arrayPromoters = []
          res.data.map((promoter) => {
            arrayPromoters.push({ value: promoter.name })
          })
          setPromoters(arrayPromoters)
          setDataPromoters(res.data)
        })
        .catch(() => {
          Alert('Error!', 'Error al cargar las productoras', 'error')
        })
    }
  }, [])

  if (cities && types && djs && promoters && djs) {
    const onChangeEventCity = (event, value) => {
      setErrorPlace('')

      if (value.length) {
        let newCitie = filterCities.filter((citie) => {
          if (citie.city_name === value[value.length - 1].value) {
            return {
              id: citie.id,
              name: citie.city_name,
            }
          }
        })

        if (newCitie[0]) {
          setDataPost({
            ...dataPost,

            event_city: newCitie[0],
          })
          setValueChipsCiudad([newCitie[0].city_name])
        } else {
          setDataPost({
            ...dataPost,
            event_city: '',
          })
          setValueChipsCiudad([])
        }
      } else {
        setDataPost({
          ...dataPost,
          event_city: '',
        })
        setValueChipsCiudad([])
      }
    }

    const onChangeEventPromoters = (event, value) => {
      let idPromoters = []
      let namePromoters = []

      if (value.length) {
        if (value.length) {
          for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < dataPromoters.length; j++) {
              if (dataPromoters[j].name === value[i].value) {
                idPromoters.push({
                  id: dataPromoters[j].id,
                })
                namePromoters.push(dataPromoters[j].name)
              }
            }
          }
        }

        setDataPost({
          ...dataPost,
          event_promoter: idPromoters,
        })
        setValueChipsProductora(namePromoters)
      } else {
        setDataPost({
          ...dataPost,
          event_promoter: [],
        })
        setValueChipsProductora([])
      }
    }

    const onChangeEventType = (event, value) => {
      let idTypes = []
      let nameTypes = []
      let valueChipType = []

      if (value.length) {
        for (let i = 0; i < value.length; i++) {
          for (let j = 0; j < dataTypes.length; j++) {
            if (dataTypes[j].name === value[i].value) {
              idTypes.push({
                id: dataTypes[j].id,
              })
              nameTypes.push({ name: dataTypes[j].name })
            }
          }
        }

        let djGeneroNameSinDuplicados = [...new Set(nameTypes.map((obj) => obj.name))].map(
          (name) => ({ name })
        )

        let idTypesSinDuplicados = [...new Set(idTypes.map((obj) => obj.id))].map((id) => ({ id }))

        for (let i = 0; i < djGeneroNameSinDuplicados.length; i++) {
          valueChipType.push(djGeneroNameSinDuplicados[i].name)
        }

        setErrorGeneros('')
        setDataCardType(djGeneroNameSinDuplicados)
        setValueChipsTypes(valueChipType)
        setDataPost({
          ...dataPost,
          event_type: idTypesSinDuplicados,
        })
      } else {
        setDataCardType([])
        setValueChipsTypes([])
        setDataPost({
          ...dataPost,
          event_type: [],
        })
      }
    }

    const onChangeEventDjs = (event, value) => {
      let idDjs = []
      let arrayDjsName = []
      let djsGenerosID = []

      let idTypes = []
      let nameTypes = []
      let valueChipType = []

      if (value.length) {
        for (let i = 0; i < value.length; i++) {
          for (let j = 0; j < dataDjs.length; j++) {
            if (dataDjs[j].name === value[i].value) {
              idDjs.push({
                id: dataDjs[j].id,
              })
              dataDjs[j].types.map((type) => {
                djsGenerosID.push(type.id)
              })
            } else if (dataDjs[j].name === value[i]) {
              idDjs.push({
                id: dataDjs[j].id,
              })
              dataDjs[j].types.map((type) => {
                djsGenerosID.push(type.id)
              })
            }
          }
        }

        for (let i = 0; i < value.length; i++) {
          if (value[i].value) {
            arrayDjsName.push(value[i].value)
          } else {
            arrayDjsName.push(value[i])
          }
        }

        for (let i = 0; i < dataTypes.length; i++) {
          for (let j = 0; j < djsGenerosID.length; j++) {
            if (dataTypes[i].id === djsGenerosID[j]) {
              nameTypes.push({ name: dataTypes[i].name })
              idTypes.push({ id: dataTypes[i].id })
            }
          }
        }

        let idTypesSinDuplicados = [...new Set(idTypes.map((obj) => obj.id))].map((id) => ({ id }))

        let djGeneroNameSinDuplicados = [...new Set(nameTypes.map((obj) => obj.name))].map(
          (name) => ({ name })
        )

        for (let i = 0; i < djGeneroNameSinDuplicados.length; i++) {
          valueChipType.push(djGeneroNameSinDuplicados[i].name)
        }

        setErrorLineUp('')
        setValueChipsTypes(valueChipType)
        setDataCardType(djGeneroNameSinDuplicados)

        setValueChipsDjs(value)
        setStringDjs(arrayDjsName)
        setDataPost({
          ...dataPost,
          event_djs: idDjs,
          event_type: idTypesSinDuplicados,
        })
      } else {
        setValueChipsDjs([])
        setStringDjs([])
        setDataPost({
          ...dataPost,
          event_djs: [],
        })
      }
    }

    const onChangeEventDate = (event) => {
      setErrorFecha('')
      const formattedDate = dayjs(event).format('YYYY-MM-DD')
      setDataPost({
        ...dataPost,
        date_from: formattedDate,
      })
    }

    const onChangeDataInput = (e) => {
      if (e.target.name === 'ticket_link') {
        axios
          .post(`${axiosUrl}/events/check-link`, {
            link: e.target.value,
          })
          .then((res) => {
            Alert('', `${res.data.message}`, '')
          })
          .catch((err) => {
            console.log(err)
          })
      }

      if (e.target.name === 'ticket_link' && errorEnlace) {
        setErrorEnlace('')
      }

      if (e.target.name === 'venue' && errorDireccion) {
        setErrorDireccion('')
      }

      setDataPost({
        ...dataPost,
        [e.target.name]: e.target.value,
      })
    }

    const onChangeDataInput2 = (e) => {
      var valueInput = e.target.value

      axios
        .post(`${axiosUrl}/events/check-link`, {
          link: valueInput,
        })
        .then((res) => {
          Alert('', `${res.data.message}`, '')
        })
        .catch((err) => {
          console.log(err)
        })

      setLoaderPupeteer(true)
      axios
        .post(axiosUrl + '/events/get-event-data', {
          link: valueInput,
        })
        .then((res) => {
          console.log(res.data)
          if (valueInput.includes('ticketpass')) {
            console.log('Ticketpass')
            setDatePupeteer(res.data.date)
            setDataPost((prevDataPost) => ({
              ...prevDataPost,
              venue: res.data.location,
              image_url: res.data.image,
              ticket_link: valueInput,
              date_from: res.data.date,
              name: res.data.tittle,
            }))
            setLoaderPupeteer(false)
          } else if (valueInput.includes('passline')) {
            console.log('Passline')
            setDatePupeteer(res.data.date)
            setDataPost((prevDataPost) => ({
              ...prevDataPost,
              venue: res.data.location,
              image_url: res.data.image,
              ticket_link: valueInput,
              date_from: res.data.date,
              name: res.data.tittle,
            }))
            setLoaderPupeteer(false)
          } else if (valueInput.includes('venti')) {
            console.log('Venti')
            let fecha = res.data.date

            if (fecha) {
              let horario = res.data.horario.split(':')
              let horas = horario[0]

              if (horas === '12' || horas === '01' || horas === '02') {
                let splitFecha = fecha.split('-')
                fecha = `${splitFecha[0]}-${splitFecha[1] - 1}-${splitFecha[2]}`
              }
            } else {
              fecha = ''
            }

            setDatePupeteer(fecha)
            setDataPost((prevDataPost) => ({
              ...prevDataPost,
              venue: res.data.location,
              image_url: res.data.image,
              ticket_link: valueInput,
              date_from: fecha,
              name: res.data.tittle,
            }))
            setLoaderPupeteer(false)
          } else {
            Alert('', 'El link proporcionado es incorrecto', '')
            setLoaderPupeteer(false)
            setDatePupeteer('')
            setDataPost((prevDataPost) => ({
              ...prevDataPost,
              venue: '',
              image_url: '',
              name: '',
              date_from: '',
              ticket_link: valueInput,
            }))
          }
        })
        .catch((err) => {
          Alert('Error!', err, 'error')
          setLoaderPupeteer(false)
          setDatePupeteer('')
          setDataPost((prevDataPost) => ({
            ...prevDataPost,
            venue: '',
            image_url: '',
            name: '',
            date_from: '',
            ticket_link: valueInput,
          }))
        })
    }

    const onSubmit = () => {
      setSubmitLoader(true)
      if (
        dataPost.event_type.length === 0 ||
        dataPost.date_from.length === 0 ||
        dataPost.venue.length === 0 ||
        dataPost.ticket_link.length === 0 ||
        dataPost.image_url.length === 0 ||
        dataPost.event_djs.length === 0 ||
        dataPost.event_city.length === 0
      ) {
        Alert('', 'Completar todos los campos', '')
        setSubmitLoader(false)
        if (dataPost.venue.length === 0) {
          setErrorDireccion('Completar campo')
        }

        if (dataPost.ticket_link.length === 0) {
          setErrorEnlace('Completar campo')
        }

        if (dataPost.event_city.length === 0) {
          setErrorPlace('Completar campo')
        }

        if (dataPost.event_djs.length === 0) {
          setErrorLineUp('Completar campo')
        }

        if (dataPost.event_type.length === 0) {
          setErrorGeneros('Completar campo')
        }

        if (dataPost.date_from.length === 0) {
          setErrorFecha('Completar campo')
        }

        if (dataPost.image_url.length === 0) {
          setErrorFile('Completar campo')
        }
      } else {
        axios
          .post(axiosUrl + '/events/create', { event: dataPost })
          .then(() => {
            setSubmitLoader(false)
            let callbackAlert = () => {
              window.location.reload()
            }
            Alert('Success!', 'Evento creado correctamente!', 'success', callbackAlert)
          })
          .catch((err) => {
            Alert('Error!', err.response.data.message, 'error') //TODO como mensaje de error podria retornar desde el back que ya existe un evento con el link
            setSubmitLoader(false)
          })
      }
    }

    const handleFileChange = async (e) => {
      setLoader(true)
      const file = e.target.files[0]
      if (file) {
        if (file.type) {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('upload_preset', 'jodify_key')
          formData.append('jodify', '')
          fetch(cloudinayUrl, {
            method: 'post',
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              const secureUrl = data.url ? data.url.replace(/^http:/, 'https:') : data.url
              setDataPost((dataPost) => ({
                ...dataPost,
                image_url: secureUrl,
              }))
              setLoader(false)
              setErrorFile('')
            })
            .catch(() => {
              Alert(
                'Error!',
                'Error en la carga de la imagen, internar nuevamente o ponerse en contaco con el servidor',
                'error'
              )
              setLoader(false)
            })
        } else {
          Alert('Error!', 'Selected file is not an image', 'error')
          setLoader(false)
        }
      }
    }

    const onClickEventCard = () => {
      if (dataPost.ticket_link === '') {
        Alert('', 'Completar el campo de Link de Venta', '')
      } else {
        let fullUrl
        if (dataPost.ticket_link.startsWith('https://')) {
          fullUrl = dataPost.ticket_link
        } else {
          const baseUrl = 'http://'
          fullUrl = baseUrl + dataPost.ticket_link
        }
        window.open(fullUrl, '_blank')
      }
    }

    const renameEvent = () => {
      setDataPost({
        ...dataPost,
        name: '',
      })
    }

    return (
      <div className={styles.body}>
        <div className={styles.form}>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <h1>Crea tu evento</h1>
          </div>

          <InputOutlined
            OnChange={onChangeDataInput2}
            Name="ticket_link"
            Placeholder="ej. https://www.passline.com / https://venti.com.ar"
            Label="Scrapping"
            Margin="32px 0px 0px 0px"
            Variant="outlined"
          />
          <p>Scrapping solo usar links de passline o venti</p>

          {!loaderPupeteer ? (
            <div>
              <InputOutlined
                OnChange={onChangeDataInput}
                Name="ticket_link"
                Placeholder="ej. www.jodify.com.ar"
                Label="Link de venta"
                Error={errorEnlace}
                Margin="32px 0px 0px 0px"
                Variant="outlined"
                Value={dataPost.ticket_link}
              />
              <p>Copiá y pegá aca el link de venta de entradas</p>
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                marginTop: '40px',
              }}
            >
              <Loader Color="#7c16f5" Height="30px" Width="30px" />
            </div>
          )}

          {!loader && !loaderPupeteer ? (
            <div
              style={{
                width: '100%',
              }}
            >
              <InputFile
                OnClick={handleFileChange}
                File={dataPost.image_url}
                Margin="32px 0px 0px 0px"
                Error={errorFile}
              />
              <InputOutlined
                OnChange={onChangeDataInput}
                Name="image_url"
                Value={dataPost.image_url}
                Placeholder="https://res.cloudinary.com/dqc865z8r/image/upload/v1706719017/lxfzhxfzenjfp"
                Label="Url imagen"
                Error={errorDireccion}
                Margin="3px 0px 0px 0px"
                Variant="outlined"
              />
              <p>Carga la imagen desde el archivo o pon la url en el input</p>
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                marginTop: '40px',
              }}
            >
              <Loader Color="#7c16f5" Height="30px" Width="30px" />
            </div>
          )}

          {!loaderPupeteer ? (
            <div>
              <DatePicker
                OnChange={onChangeEventDate}
                Label="Fecha el evento"
                Margin="32px 0px 0px 0px"
                Error={errorFecha}
                InitialDate={datePupeteer}
              />
              <p>Selecciona la fecha del evento</p>
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                marginTop: '40px',
              }}
            >
              <Loader Color="#7c16f5" Height="30px" Width="30px" />
            </div>
          )}

          {!loaderPupeteer ? (
            <div>
              <InputOutlined
                OnChange={onChangeDataInput}
                Name="venue"
                Value={dataPost.venue}
                Placeholder="ej. Av. Libertador 2647 (Beccar)"
                Label="Ubicacion"
                Error={errorDireccion}
                Margin="32px 0px 0px 0px"
                Variant="outlined"
              />
              <p>Escribi la direccion o nombre del lugar con la localidad entre parentesis</p>
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                marginTop: '40px',
              }}
            >
              <Loader Color="#7c16f5" Height="30px" Width="30px" />
            </div>
          )}

          <SelectMaterial
            Option="Ciudad"
            Array={cities}
            OnChange={onChangeEventCity}
            Margin="32px 0px 0px 0px"
            Error={errorPlace}
            ValuesChips={valueChipsCiudad}
          />
          <p>Selecciona la ciudad donde figurara el evento</p>

          <SelectMaterial
            Option="Productora"
            Array={promoters}
            OnChange={onChangeEventPromoters}
            Margin="32px 0px 0px 0px"
            ValuesChips={valueChipsProductora}
          />
          <p>Selecciona su productora</p>

          <SelectMaterial
            Option="Line up"
            Array={djs}
            OnChange={onChangeEventDjs}
            Margin="32px 0px 0px 0px"
            Error={errorLineUp}
            FreeSolo="true"
            ValuesChips={valueChipsDjs}
          />
          <p>Incluye los djs que tocaran</p>

          <SelectMaterial
            Option="Géneros musicales"
            Array={types}
            OnChange={onChangeEventType}
            Margin="32px 0px 0px 0px"
            Error={errorGeneros}
            ValuesChips={valueChipsTypes}
          />
          <p>Selecciona los generon que habra</p>

          {!loaderPupeteer ? (
            <div>
              <InputOutlined
                OnChange={onChangeDataInput}
                Name="name"
                Value={dataPost.name}
                Placeholder="ej. Jodify Winter Fest"
                Label="Nombre del evento"
                Error=""
                Margin="32px 0px 0px 0px"
                Requiere="false"
                Variant="outlined"
              />
              <p>Si lo deseas, puedes personalizar aqui el nombre del evento</p>
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                marginTop: '40px',
              }}
            >
              <Loader Color="#7c16f5" Height="30px" Width="30px" />
            </div>
          )}

          <div className={styles.containerCard}>
            <EventCard
              Img={dataPost.image_url}
              SecondTittle={dataPost.name}
              Tittle={stringDjs}
              Location={dataPost.venue}
              Genre={dataCardType}
              OnClick={onClickEventCard}
              Color="#AE71F9"
            />
          </div>

          <div className={styles.containerButton}>
            <Button Value="Renombrar" OnClick={renameEvent} Color="#000000" Hover="#1B1C20" />
            {!submitLoader ? (
              <Button Value="Publicar" OnClick={onSubmit} />
            ) : (
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                }}
              >
                <Loader Color="#7c16f5" Height="30px" Width="30px" />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles.body}>
        <Loader Color="#7c16f5" Height="100px" Width="100px" />
      </div>
    )
  }
}

export default CreateFormPage
