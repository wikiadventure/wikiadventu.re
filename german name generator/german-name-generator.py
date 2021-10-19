import sys, os, random

familynames=[]
fnames=dict()
familynames_count=[]
names_m=[]
names_w=[]

def prepare_name_lists():
  f_names_m=open("vornamen_m_deutsch", "r")
  f_names_w=open("vornamen_w_deutsch", "r")
  f_familynames=open("nachnamen_deutsch", "r")
  
  l_familynames=list(f_familynames)
  for i in l_familynames:
    j=i.split(" ", -1)
    name=j[0].strip()
    count=int(j[-1].strip())

    fnames[(sum(familynames_count),sum(familynames_count)+count)]=name # tuple-key will later be used as range to pick names by randint

    familynames.append(name)
    familynames_count.append(count)

  ## remove whitespaces/linebreaks ()
  l_names_m=list(f_names_m)
  for i in l_names_m: names_m.append(i.strip())  
  l_names_w=list(f_names_w)
  for i in l_names_w: names_w.append(i.strip())


def get_random_familyname():
  """# the following was the naive implementation
  total=sum(familyname_count)
  x=familyname_count[0]
  r=random.randint(0, total-1)
  i=0
  while x < r:
    x+=familyname_count[i]
    i+=1
  return familyname[i]
  """
  r=random.randint(0, sum(familynames_count)-1)
  for k in fnames.keys():
    if r in range(k[0], k[1]): return fnames[k]
  raise # if this point is reached something went wrong


def get_random_from_list(l):
  assert(l!=[] and l is not None)
  x=random.randint(0, len(l)-1)
  r=l[x]
  return r


def get_random_name(gender="any"):
  if gender=="any":
    if random.random() < 0.5: gender="m"
    else: gender="w"
  assert(gender in ["any", "m", "w"])

  name="<TEST>"
  if gender=="any":
    name=get_random_from_list(list(names_m, names_w))
  elif gender=="m":
    name=get_random_from_list(names_m)
  elif gender=="w":
    name=get_random_from_list(names_w)
  assert(name!="<TEST>")

  return name

def get_random_name_list(n, gender="any"):
  assert(gender in ["m", "w", "any"] and n>0)
  if familynames==[] or names_m==[] or names_w==[]: prepare_name_lists()
  l=[]
  for i in range(0, n): l.append(get_random_name(gender)+" "+get_random_familyname())
  return l



if __name__ == "__main__":
  prepare_name_lists()
  if len(sys.argv) == 2: #and sys.argv[1] in ["m", "w", "any"]:
    print(get_random_name(sys.argv[1]), get_random_familyname())
  elif len(sys.argv) == 3 and int(sys.argv[2]) > 0: #and sys.argv[1] in ["m", "w", "any"]:
    for i in range(0, int(sys.argv[2])): print(get_random_name(sys.argv[1]), get_random_familyname())
  else:
    print(get_random_name(), get_random_familyname())

  exit(0)
